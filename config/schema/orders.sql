CREATE TABLE IF NOT EXISTS orders (
    id       SERIAL PRIMARY KEY,
    ts       TIMESTAMP NOT NULL DEFAULT NOW(),
    name     VARCHAR(32) NOT NULL,
    phone    VARCHAR(32) NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_id ON orders (id);

