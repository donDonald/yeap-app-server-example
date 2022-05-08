CREATE TABLE IF NOT EXISTS customers (
    cid             SERIAL PRIMARY KEY,
    name            VARCHAR (100) NOT NULL,
    phone           VARCHAR (15) NOT NULL,
    ts              TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_customers_cid ON customers (cid);

