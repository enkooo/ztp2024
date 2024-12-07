-- Table: public.merchant

-- DROP TABLE IF EXISTS public.merchant;

CREATE TABLE IF NOT EXISTS public.merchant
(
    nip character(12) COLLATE pg_catalog."default" NOT NULL,
    request_id uuid,
    CONSTRAINT merchant_pkey PRIMARY KEY (nip)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.merchant
    OWNER to postgres;