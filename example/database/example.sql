CREATE TABLE races (
  entries INTEGER NOT NULL,
  name    VARCHAR2(64) NOT NULL,
  data    DATE NOT NULL
);

INSERT ALL
   INTO races (entries, name, data) VALUES (30, 'Race 1', sysdate - 5/24)
   INTO races (entries, name, data) VALUES (26, 'Race 2', sysdate - 4/24)
   INTO races (entries, name, data) VALUES (30, 'Race 3', sysdate - 3/24)
   INTO races (entries, name, data) VALUES (28, 'Race 4', sysdate - 2/24)
   INTO races (entries, name, data) VALUES (32, 'Race 5', sysdate - 1/24)
   INTO races (entries, name, data) VALUES (34, 'Final', sysdate)
SELECT 1 FROM DUAL;

ALTER SESSION SET "_ORACLE_SCRIPT"=true;
CREATE USER oracle_user IDENTIFIED BY oracle_password;
GRANT CREATE SESSION TO oracle_user;
GRANT SELECT ON races TO oracle_user;
