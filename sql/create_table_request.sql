-- Table: public.request

-- DROP TABLE IF EXISTS public.request;

CREATE TABLE IF NOT EXISTS public.request
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    nip character(12) COLLATE pg_catalog."default",
    createdate timestamp without time zone DEFAULT now(),
    status smallint DEFAULT 0,
    notes text COLLATE pg_catalog."default",
    name text COLLATE pg_catalog."default",
    email text COLLATE pg_catalog."default",
    phone text COLLATE pg_catalog."default",
    address text COLLATE pg_catalog."default",
    CONSTRAINT wnioski_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.request
    OWNER to postgres;

COMMENT ON COLUMN public.request.status
    IS '0 - wniosek do procesowania
1 - wniosek procesowany
2 - wniosek rozpatrzony pozytywnie
3 - wniosek odrzucony';



-- ALTER TABLE request ADD CONSTRAINT unique_nip UNIQUE (nip);

-- ALTER TABLE request ADD CONSTRAINT unique_email UNIQUE (email);

