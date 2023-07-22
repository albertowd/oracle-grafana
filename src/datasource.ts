import { DataSourceInstanceSettings, CoreApp, MetricFindValue, dateTime, DataFrame, DataQueryRequest, DataQueryResponse } from '@grafana/data';
import { DataSourceWithBackend } from '@grafana/runtime';
import { Observable, lastValueFrom, map, switchMap } from 'rxjs';

import { interpolate } from './interpolate';
import { MyQuery, MyDataSourceOptions } from './types';

export class DataSource extends DataSourceWithBackend<MyQuery, MyDataSourceOptions> {
  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);
  }

  query(request: DataQueryRequest<MyQuery>): Observable<DataQueryResponse> {
    for(const query of request.targets) {
      if (request.scopedVars && Object.keys(request.scopedVars).length > 0) {
        query.o_parsed = interpolate(query.o_sql || '', request.scopedVars);
      }
    }
    return super.query(request)
  }

  /**
   * Method implemented to use the Query variable available to this datasource.
   * @param query User defined query.
   * @param options Query options.
   * @returns 
   */
  async metricFindQuery(query: string, options?: any): Promise<MetricFindValue[]> {
    if (!query) {
      return Promise.resolve([]);
    }

    const response = this.query({
      interval: '',
      intervalMs: 0,
      requestId: 'metricFindQuery',
      range: {
        from: dateTime(),
        to: dateTime(),
        raw: {
          from: dateTime(),
          to: dateTime()
        }
      },
      scopedVars: {},
      targets: [{
        datasource: this.getDefaultQuery(CoreApp.Unknown).datasource,
        o_parsed: query,
        refId: 'A'
      }],
      timezone: 'Z',
      app: '',
      startTime: 0,
    });

    return lastValueFrom(response.pipe(
      switchMap(response => response.data),
      switchMap((data: DataFrame) => data.fields),
      map(field =>
        field.values.toArray().map(value => {
          return { text: value };
        })
      )
    ));
  }

  getDefaultQuery(_: CoreApp): Partial<MyQuery> {
    return {
      o_sql: 'SELECT * \n FROM SYS.races \nWHERE data BETWEEN $__from AND $__to',
    }
  }
}
