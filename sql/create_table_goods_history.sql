-- Table: public.goods_history

-- DROP TABLE IF EXISTS public.goods_history;

CREATE TABLE IF NOT EXISTS public.goods_history
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    goods_id bigint,
    status smallint DEFAULT 0,
    updated timestamp without time zone DEFAULT now(),
    CONSTRAINT goods_history_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.goods_history
    OWNER to postgres;

COMMENT ON COLUMN public.goods_history.status
    IS '0 świeżo utworzony
1 skierowany do obrotu
2 zarezerwowany
3 w sprzedaży
4 po zwrocie';