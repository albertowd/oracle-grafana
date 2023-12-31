package plugin

import (
	"database/sql"
	"encoding/json"
	"io"
	"time"

	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/backend/log"
)

type OracleDatasourceQuery struct {
	Datasource   OracleDatasourceInfo
	DatasourceId int64
	IntervalMs   int64
	O_parsed     string
	O_sql        string
	RefId        string
}

type OracleDatasourceInfo struct {
	Type string
	Uid  string
}

type OracleDatasourceColumn struct {
	name   string
	values []string
}

type OracleDatasourceResult struct {
	err     error
	columns []OracleDatasourceColumn
}

func (q *OracleDatasourceQuery) MakeQuery(c *OracleDatasourceConnection, from time.Time, to time.Time) OracleDatasourceResult {
	result := OracleDatasourceResult{nil, []OracleDatasourceColumn{}}

	if c.IsConnected() {
		stmt, err := c.connection.Prepare(q.O_parsed)
		if err != nil {
			log.DefaultLogger.Error("Error preparing SQL: ", err)
			result.err = err
			return result
		}
		defer stmt.Close()

		rows, err := stmt.Query()
		if err != nil {
			log.DefaultLogger.Error("Error querying SQL: ", err)
			result.err = err
			return result
		}
		defer rows.Close()

		columns, err := rows.Columns()
		if err != nil {
			log.DefaultLogger.Error("Error fetching columns: ", err)
			result.err = err
			return result
		} else {
			for _, name := range columns {
				result.columns = append(result.columns, OracleDatasourceColumn{name, []string{}})
			}
		}
		log.DefaultLogger.Debug("Oracle query fetch: ", "columns", columns)

		sacnValues := make([]sql.RawBytes, len(columns))
		scanArgs := make([]interface{}, len(columns))
		for i := range scanArgs {
			scanArgs[i] = &sacnValues[i]
		}

		for rows.Next() {
			err := rows.Scan(scanArgs...)
			if err != nil {
				log.DefaultLogger.Error("Error scanning row: ", err)
				break
			}
			for index, scannedValue := range sacnValues {
				if scannedValue != nil {
					result.columns[index].values = append(result.columns[index].values, string(scannedValue))
				} else {
					result.columns[index].values = append(result.columns[index].values, "(null)")
				}
			}
		}

		if rows.Err() != nil && rows.Err() != io.EOF {
			result.err = err
			log.DefaultLogger.Error("Error fetching row: ", err)
		}
	}

	log.DefaultLogger.Debug("Oracle query: ", "result", result)
	return result
}

func (q *OracleDatasourceQuery) ParseDatasourceQuery(query backend.DataQuery) error {
	log.DefaultLogger.Debug("backend query", "json", query.JSON)
	err := json.Unmarshal(query.JSON, &q)
	if err != nil {
		log.DefaultLogger.Error("Error parsing Oracle query: ", err)
	}
	return err
}
