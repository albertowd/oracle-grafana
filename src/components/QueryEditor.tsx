import React, { FormEvent } from 'react';
import { ActionMeta, HorizontalGroup, Select, TextArea, VerticalGroup } from '@grafana/ui';
import { QueryEditorProps, SelectableValue } from '@grafana/data';
import { DataSource } from '../datasource';
import { MyDataSourceOptions, MyQuery } from '../types';

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

export function QueryEditor({ query, onChange }: Props) {
  const onSQLChange = (event: FormEvent<HTMLTextAreaElement>) => {
    onChange({ ...query, o_sql: event.currentTarget.value });
  }

  const onTypeChange = (value: SelectableValue<string>, _: ActionMeta) => {
    onChange({ ...query, o_type: value.value });
  }

  const typeOption = [
    {
      label: 'Timeseries',
      value: 'timeseries'
    },
    {
      label: 'Table',
      value: 'table'
    }
  ];

  return (
    <VerticalGroup width='100%'>
      <HorizontalGroup width='100%'>
        <Select options={typeOption} onChange={onTypeChange} value={query.o_type} />
      </HorizontalGroup>
      <TextArea width="100%" onChange={onSQLChange} placeholder='SELECT *\n FROM SYS.races' value={query.o_sql} />
    </VerticalGroup>
  );
}
