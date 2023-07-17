import React, { FormEvent } from 'react';
import { TextArea, VerticalGroup } from '@grafana/ui';
import { QueryEditorProps } from '@grafana/data';
import { DataSource } from '../datasource';
import { MyDataSourceOptions, MyQuery } from '../types';

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

export function QueryEditor({ query, onChange, onRunQuery }: Props) {
  const onSQLChange = (event: FormEvent<HTMLTextAreaElement>) => {
    onChange({ ...query, o_sql: event.currentTarget.value });
    onRunQuery();
  }

  return (
    <VerticalGroup width='100%'>
      <TextArea width="100%" onChange={onSQLChange} placeholder='SELECT *\n FROM SYS.races' value={query.o_sql} />
    </VerticalGroup>
  );
}
