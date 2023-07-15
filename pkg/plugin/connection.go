package plugin

import (
	"database/sql"
	"io"

	"github.com/grafana/grafana-plugin-sdk-go/backend/log"
	go_ora "github.com/sijms/go-ora/v2"
)

type OracleDatasourceConnection struct {
	connection *sql.DB
}

func (c *OracleDatasourceConnection) Connect(settings OracleDatasourceSettings) error {
	log.DefaultLogger.Debug("CONNECT")
	var err error
	if !c.IsConnected() {
		urlOptions := map[string]string{}
		if len(settings.O_sid) > 0 {
			urlOptions["SID"] = settings.O_sid
		}
		connectionString := go_ora.BuildUrl(settings.O_hostname, settings.O_port, settings.O_service, settings.O_user, settings.O_password, urlOptions)
		log.DefaultLogger.Debug(connectionString)

		connection, conErr := sql.Open("oracle", connectionString)
		if conErr != nil {
			err = conErr
			log.DefaultLogger.Error("Error connecting to Oracle: ", err)
		} else {
			c.connection = connection
			err = c.Ping()
		}
	}
	return err
}

func (c *OracleDatasourceConnection) Disconnect() error {
	log.DefaultLogger.Debug("DISCONNECT")
	var err error
	if c.IsConnected() {
		err = c.connection.Close()
		if err != nil {
			log.DefaultLogger.Error("Error closing Oracle connection: ", err)
		}
		c.connection = nil
	}
	return err
}

func (c *OracleDatasourceConnection) IsConnected() bool {
	if c.connection != nil {
		return true
	} else {
		return false
	}
}

func (c *OracleDatasourceConnection) MakeQuery(sql string, isTimeseries bool) map[string][]string {
	results := map[string][]string{}

	if c.IsConnected() {
		stmt, err := c.connection.Prepare(sql)
		defer stmt.Close()
		if err != nil {
			log.DefaultLogger.Error("Error preparing SQL: ", err)
			return results
		}
		rows, err := stmt.Query()
		defer rows.Close()
		if err != nil {
			log.DefaultLogger.Error("Error querying SQL: ", err)
			return results
		}

		columns, err := rows.Columns()
		if err != nil {
			log.DefaultLogger.Error("Error fetching columns: ", err)
			return results
		}
		columnTypes, err := rows.ColumnTypes()
		if err != nil {
			log.DefaultLogger.Error("Error fetching column types: ", err)
			return results
		}
		log.DefaultLogger.Debug("Column types: ", columnTypes)
		values := make([]string, len(columns))

		for rows.Next() {
			err := rows.Scan(&values)
			if err != nil {
				break
			}
			log.DefaultLogger.Debug("Values: ", values)
			for i, val := range values {
				results[columns[i]] = append(results[columns[i]], val)
			}
		}

		if rows.Err() != nil && rows.Err() != io.EOF {
			log.DefaultLogger.Error("Error fetching row: ", err)
		}
	}

	log.DefaultLogger.Debug("Results: ", results)
	return results
}

func (c *OracleDatasourceConnection) Ping() error {
	var err error
	log.DefaultLogger.Debug("PIIIIIIIIIIING")
	if c.IsConnected() {
		err = c.connection.Ping()
		if err != nil {
			log.DefaultLogger.Error("Error pingging Oracle connection: ", err)
		}
	}
	return err
}

func (c *OracleDatasourceConnection) Reconnect(settings OracleDatasourceSettings) error {
	log.DefaultLogger.Debug("RECONNECT")
	var err error
	if c.IsConnected() {
		err = c.Disconnect()
	}
	err = c.Connect(settings)
	return err
}
