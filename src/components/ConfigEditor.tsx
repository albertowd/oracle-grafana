import React, { ChangeEvent } from 'react';
import { InlineField, Input, SecretInput } from '@grafana/ui';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { MyDataSourceOptions, MySecureJsonData } from '../types';

interface Props extends DataSourcePluginOptionsEditorProps<MyDataSourceOptions> { }

export function ConfigEditor(props: Props) {
  const { onOptionsChange, options } = props;

  const onHostnameChange = (event: ChangeEvent<HTMLInputElement>) => {
    onOptionsChange({
      ...options,
      jsonData: {
        ...options.jsonData,
        o_hostname: event.target.value,
      }
    });
  };

  const onPortChange = (event: ChangeEvent<HTMLInputElement>) => {
    onOptionsChange({
      ...options,
      jsonData: {
        ...options.jsonData,
        o_port: Number(event.target.value),
      }
    });
  };

  const onServiceChange = (event: ChangeEvent<HTMLInputElement>) => {
    onOptionsChange({
      ...options,
      jsonData: {
        ...options.jsonData,
        o_service: event.target.value,
      }
    });
  };

  const onSIDChange = (event: ChangeEvent<HTMLInputElement>) => {
    onOptionsChange({
      ...options,
      jsonData: {
        ...options.jsonData,
        o_sid: event.target.value,
      }
    });
  };

  const onUserChange = (event: ChangeEvent<HTMLInputElement>) => {
    onOptionsChange({
      ...options,
      jsonData: {
        ...options.jsonData,
        o_user: event.target.value,
      }
    });
  };

  // Secure field (only sent to the backend)
  const onPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    onOptionsChange({
      ...options,
      secureJsonData: {
        o_password: event.target.value,
      },
    });
  };

  const onPasswordReset = () => {
    onOptionsChange({
      ...options,
      secureJsonFields: {
        ...options.secureJsonFields,
        o_password: false
      },
      secureJsonData: {
        ...options.secureJsonData,
        o_password: ''
      },
    });
  };

  const { jsonData, secureJsonFields } = options;
  const secureJsonData = (options.secureJsonData || {}) as MySecureJsonData;

  return (
    <div className="gf-form-group">
      <div className="gf-form">
        <InlineField label="Hostname" labelWidth={12}>
          <Input
            placeholder="localhost"
            value={jsonData.o_hostname}
            width={40}
            onChange={onHostnameChange}
          />
        </InlineField>
      </div>
      <InlineField label="Password" labelWidth={12}>
        <SecretInput
          isConfigured={(secureJsonFields && secureJsonFields.o_password) as boolean}
          placeholder="oracle_password"
          value={secureJsonData.o_password}
          width={40}
          onChange={onPasswordChange}
          onReset={onPasswordReset}
        />
      </InlineField>
      <div className="gf-form">
        <InlineField label="Port" labelWidth={12}>
          <Input
            placeholder="1521"
            type="number"
            value={jsonData.o_port}
            width={40}
            onChange={onPortChange}
          />
        </InlineField>
      </div>
      <div className="gf-form">
        <InlineField label="Service" labelWidth={12}>
          <Input
            placeholder=""
            value={jsonData.o_service}
            width={40}
            onChange={onServiceChange}
          />
        </InlineField>
      </div>
      <div className="gf-form">
        <InlineField label="SID" labelWidth={12}>
          <Input
            placeholder="XE"
            value={jsonData.o_sid}
            width={40}
            onChange={onSIDChange}
          />
        </InlineField>
      </div>
      <div className="gf-form">
        <InlineField label="User" labelWidth={12}>
          <Input
            placeholder="oracle_user"
            value={jsonData.o_user}
            width={40}
            onChange={onUserChange}
          />
        </InlineField>
      </div>
    </div>
  );
}
