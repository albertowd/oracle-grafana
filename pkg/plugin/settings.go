package plugin

import (
	"encoding/json"

	"github.com/grafana/grafana-plugin-sdk-go/backend/log"
)

type OracleDatasourceSettings struct {
	O_hostname string
	O_password string
	O_port     int
	O_service  string
	O_sid      string
	O_user     string
}

func ParseDatasourceSettings(rawOptions json.RawMessage, decryptedOptions map[string]string) OracleDatasourceSettings {
	log.DefaultLogger.Debug("Error on  ", "settings", rawOptions)
	settings := OracleDatasourceSettings{}
	settings.O_password = decryptedOptions["o_password"]
	err := json.Unmarshal(rawOptions, &settings)
	if err != nil {
		log.DefaultLogger.Error("Error parsing Oracle datasource settings: ", err)
	}
	return settings
}
