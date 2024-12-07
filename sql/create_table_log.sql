-- Table: public.log

-- DROP TABLE IF EXISTS public.log;

CREATE TABLE IF NOT EXISTS public.log
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    createdate timestamp without time zone DEFAULT now(),
    event json,
    CONSTRAINT log_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.log
    OWNER to postgres;