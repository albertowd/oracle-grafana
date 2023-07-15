package plugin

import (
	"encoding/json"

	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/backend/log"
)

type OracleDatasourceQuery struct {
	Datasource   OracleDatasourceInfo
	DatasourceId int64
	IntervalMs   int64
	O_sql        string
	O_type       string
	RefId        string
}

type OracleDatasourceInfo struct {
	Type string
	Uid  string
}

func ParseDatasourceQuery(query backend.DataQuery) (OracleDatasourceQuery, error) {
	queryInfo := OracleDatasourceQuery{}
	err := json.Unmarshal(query.JSON, &queryInfo)
	if err != nil {
		log.DefaultLogger.Error("Error parsing Oracle query: ", err)
	}
	return queryInfo, err
}
