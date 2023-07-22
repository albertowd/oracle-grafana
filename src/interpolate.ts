import { ScopedVars } from '@grafana/data';
import { getTemplateSrv } from '@grafana/runtime';

export function interpolate(o_sql: string, scopedVars?: ScopedVars): string {
  let o_parsed = o_sql;
  if (o_parsed.includes('$__from')) {
    o_parsed = o_parsed.replace(/\$__from/g, `TO_TIMESTAMP('1970-01-01 00:00:00', 'YYYY-MM-DD HH24:MI:SS') + NUMTODSINTERVAL($__from / 1000, 'SECOND')`);
  }
  if (o_parsed.includes('$__to')) {
    o_parsed = o_parsed.replace(/\$__to/g, `TO_TIMESTAMP('1970-01-01 00:00:00', 'YYYY-MM-DD HH24:MI:SS') + NUMTODSINTERVAL($__to / 1000, 'SECOND')`);
  }
  return getTemplateSrv().replace(o_parsed, scopedVars);
};
