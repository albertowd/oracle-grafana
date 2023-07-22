import React, { ChangeEvent } from 'react';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { HorizontalGroup, InlineField, Input, Legend, SecretInput, VerticalGroup } from '@grafana/ui';
import { MyDataSourceOptions, MySecureJsonData } from '../types';

interface Props extends DataSourcePluginOptionsEditorProps<MyDataSourceOptions> { }

export function ConfigEditor(props: Props) {
  const { onOptionsChange, options } = props;

  const onConnStrChange = (event: ChangeEvent<HTMLInputElement>) => {
    onOptionsChange({
      ...options,
      jsonData: {
        ...options.jsonData,
        o_connStr: event.target.value,
      }
    });
  };

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
        o_sid: ''
      }
    });
  };

  const onSIDChange = (event: ChangeEvent<HTMLInputElement>) => {
    onOptionsChange({
      ...options,
      jsonData: {
        ...options.jsonData,
        o_service: '',
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
    <VerticalGroup>
      <Legend>
        Authentication
      </Legend>
      <HorizontalGroup>
        <InlineField grow label="User" labelWidth={12}>
          <Input
            placeholder="oracle_user"
            required
            value={jsonData.o_user}
            width={40}
            onChange={onUserChange}
          />
        </InlineField>
        <InlineField grow label="Password" labelWidth={12}>
          <SecretInput
            isConfigured={(secureJsonFields && secureJsonFields.o_password) as boolean}
            placeholder="oracle_password"
            required
            value={secureJsonData.o_password}
            width={40}
            onChange={onPasswordChange}
            onReset={onPasswordReset}
          />
        </InlineField>
      </HorizontalGroup>
      <Legend>
        Connection
      </Legend>
      <InlineField grow label="ConnString" labelWidth={12}>
        <Input
          placeholder="(DESCRIPTION=(ADDRESS=(PROTOCOL=tcp)(HOST=localhost)(PORT=1521))(CONNECT_DATA=(SID=XE)))"
          value={jsonData.o_connStr}
          width={94}
          onChange={onConnStrChange}
        />
      </InlineField>
      <HorizontalGroup>
        <InlineField grow label="Hostname" labelWidth={12}>
          <Input
            placeholder="localhost"
            value={jsonData.o_hostname}
            width={40}
            onChange={onHostnameChange}
          />
        </InlineField>
        <InlineField grow label="Port" labelWidth={12}>
          <Input
            placeholder="1521"
            type="number"
            value={jsonData.o_port}
            width={40}
            onChange={onPortChange}
          />
        </InlineField>
      </HorizontalGroup>
      <HorizontalGroup>
        <InlineField grow label="Service" labelWidth={12}>
          <Input
            placeholder=""
            value={jsonData.o_service}
            width={40}
            onChange={onServiceChange}
          />
        </InlineField>
        <InlineField grow label="or SID" labelWidth={12}>
          <Input
            placeholder="XE"
            value={jsonData.o_sid}
            width={40}
            onChange={onSIDChange}
          />
        </InlineField>
      </HorizontalGroup>
    </VerticalGroup>
  );
}
