SELECT 'Entries' as name, TO_CHAR(data, 'YYYY-MM-DD"T"HH24:MI:SS') as ts, entries as value
  FROM SYS.races
 WHERE data BETWEEN :g_from AND :g_to
 ORDER BY data ASC

SELECT entries, name, TO_CHAR(data, 'YYYY-MM-DD"T"HH24:MI:SS') as data
  FROM SYS.races
 WHERE data BETWEEN :g_from AND :g_to

SELECT 'Entries' as name, TO_CHAR(data, 'YYYY-MM-DD"T"HH24:MI:SS') as ts, entries as value
  FROM SYS.races
 WHERE data BETWEEN TO_DATE(sysdate - 1, 'YYYY-MM-DD"T"HH24:MI:SS') AND TO_DATE(sysdate, 'YYYY-MM-DD"T"HH24:MI:SS')
 ORDER BY data ASC

SELECT entries, name, TO_CHAR(data, 'YYYY-MM-DD"T"HH24:MI:SS') as data
  FROM SYS.races
 WHERE data BETWEEN TO_DATE(sysdate - 1, 'YYYY-MM-DD"T"HH24:MI:SS') AND TO_DATE(sysdate, 'YYYY-MM-DD"T"HH24:MI:SS')
