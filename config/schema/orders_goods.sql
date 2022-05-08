CREATE TABLE IF NOT EXISTS orders_goods (
    oid                   SERIAL NOT NULL REFERENCES orders(oid) ON DELETE CASCADE,
    gid                   VARCHAR(32) NOT NULL REFERENCES goods(gid) ON DELETE CASCADE,
    ts                    TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (oid, gid),
    UNIQUE (oid, gid)
);

CREATE INDEX IF NOT EXISTS idx_orders_goods_oid ON orders_goods (oid);
CREATE INDEX IF NOT EXISTS idx_orders_goods_gid ON orders_goods (gid);
CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_goods_oid_gid ON orders_goods (oid, gid);

