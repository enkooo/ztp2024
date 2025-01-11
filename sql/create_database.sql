-- Database: ztp2024

-- DROP DATABASE IF EXISTS ztp2024;

-- CREATE DATABASE ztp2024
--     WITH
--     OWNER = postgres
--     ENCODING = 'UTF8'
--     LC_COLLATE = 'Polish_Poland.1250'
--     LC_CTYPE = 'Polish_Poland.1250'
--     LOCALE_PROVIDER = 'libc'
--     TABLESPACE = pg_default
--     CONNECTION LIMIT = -1
--     IS_TEMPLATE = False;

CREATE DATABASE ztp2024
WITH
OWNER = postgres
ENCODING = 'UTF8'
LC_COLLATE = 'pl_PL.UTF-8'
LC_CTYPE = 'pl_PL.UTF-8'
LOCALE_PROVIDER = libc
TABLESPACE = pg_default
CONNECTION LIMIT = -1
IS_TEMPLATE = False;
