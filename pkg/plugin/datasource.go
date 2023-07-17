package plugin

import (
	"context"
	"fmt"

	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/backend/instancemgmt"
	"github.com/grafana/grafana-plugin-sdk-go/backend/log"
	"github.com/grafana/grafana-plugin-sdk-go/data"

	_ "github.com/sijms/go-ora/v2"
)

// Make sure Datasource implements required interfaces. This is important to do
// since otherwise we will only get a not implemented error response from plugin in
// runtime. In this example datasource instance implements backend.QueryDataHandler,
// backend.CheckHealthHandler interfaces. Plugin should not implement all these
// interfaces- only those which are required for a particular task.
var (
	_ backend.QueryDataHandler      = (*OracleDatasource)(nil)
	_ backend.CheckHealthHandler    = (*OracleDatasource)(nil)
	_ instancemgmt.InstanceDisposer = (*OracleDatasource)(nil)
)

// Datasource is an example datasource which can respond to data queries, reports
// its health and has streaming skills.
type OracleDatasource struct {
	connection OracleDatasourceConnection
	name       string
	settings   OracleDatasourceSettings
}

// NewDatasource creates a new datasource instance.
func NewDatasource(settings backend.DataSourceInstanceSettings) (instancemgmt.Instance, error) {
	datasourceSettings := ParseDatasourceSettings(settings.JSONData, settings.DecryptedSecureJSONData)
	log.DefaultLogger.Debug("New datasource", "name", settings.Name, "settings", datasourceSettings)
	return &OracleDatasource{OracleDatasourceConnection{}, settings.Name, datasourceSettings}, nil
}

// CheckHealth handles health checks sent from Grafana to the plugin.
// The main use case for these health checks is the test button on the
// datasource configuration page which allows users to verify that
// a datasource is working as expected.
func (d *OracleDatasource) CheckHealth(_ context.Context, req *backend.CheckHealthRequest) (*backend.CheckHealthResult, error) {
	message := "Oracle datasource succesfully connected!"
	status := backend.HealthStatusOk

	d.name = req.PluginContext.DataSourceInstanceSettings.Name
	d.settings = ParseDatasourceSettings(req.PluginContext.DataSourceInstanceSettings.JSONData, req.PluginContext.DataSourceInstanceSettings.DecryptedSecureJSONData)
	log.DefaultLogger.Debug("Health check datasource settings", "name", d.name, "object", d.settings)

	err := d.connection.Reconnect(&d.settings)
	if err != nil {
		message = "Health check error: " + err.Error()
		status = backend.HealthStatusError
	}

	return &backend.CheckHealthResult{
		Message: message,
		Status:  status,
	}, nil
}

// Dispose here tells plugin SDK that plugin wants to clean up resources when a new instance
// created. As soon as datasource settings change detected by SDK old datasource instance will
// be disposed and a new one will be created using NewSampleDatasource factory function.
func (d *OracleDatasource) Dispose() {
	// Clean up datasource instance resources.
	err := d.connection.Disconnect()
	if err != nil {
		log.DefaultLogger.Error("Error closing Oracle connection: ", err)
	}
}

// QueryData handles multiple queries and returns multiple responses.
// req contains the queries []DataQuery (where each query contains RefID as a unique identifier).
// The QueryDataResponse contains a map of RefID to the response for each query, and each response
// contains Frames ([]*Frame).
func (d *OracleDatasource) QueryData(ctx context.Context, req *backend.QueryDataRequest) (*backend.QueryDataResponse, error) {
	// create response struct
	var err error
	response := backend.NewQueryDataResponse()

	if !d.connection.IsConnected() {
		err = d.connection.Connect(&d.settings)
	}

	// loop over queries and execute them individually.
	for _, q := range req.Queries {
		if err != nil {
			response.Responses[q.RefID] = backend.ErrDataResponse(backend.StatusBadRequest, fmt.Sprintf("Error connecting datasource: %v", err.Error()))
		} else {
			res := d.query(ctx, req.PluginContext, q)
			// save the response in a hashmap
			// based on with RefID as identifier
			response.Responses[q.RefID] = res
		}
	}

	return response, nil
}

type queryModel struct{}

func (d *OracleDatasource) query(_ context.Context, pCtx backend.PluginContext, query backend.DataQuery) backend.DataResponse {
	var response backend.DataResponse

	queryObj := OracleDatasourceQuery{}
	err := queryObj.ParseDatasourceQuery(query)
	log.DefaultLogger.Debug(fmt.Sprintf("Executing new query: (%s) %+v", query.QueryType, queryObj))
	if err != nil {
		return backend.ErrDataResponse(backend.StatusBadRequest, fmt.Sprintf("Error parsing query: %v", err.Error()))
	}

	result := queryObj.MakeQuery(&d.connection)

	// create data frame response.
	// For an overview on data frames and how grafana handles them:
	// https://grafana.com/docs/grafana/latest/developers/plugins/data-frames/
	frame := data.NewFrame("response")

	// add fields.
	for _, column := range result.columns {
		frame.Fields = append(frame.Fields, data.NewField(column.name, nil, column.values))
	}

	// add the frames to the response.
	response.Frames = append(response.Frames, frame)

	return response
}
