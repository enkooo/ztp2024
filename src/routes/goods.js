const express = require("express");
const { getClient } = require("../db/client");
const router = express.Router();

router.get("/", (req, res) => {
  const selection = `WHERE goods::text ILIKE`;
  getClient().query(
    `SELECT COUNT(*) FROM goods ${selection} $1`,
    [`%${req.query.search || ""}%`],
    (err, data) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      const total = parseInt(data.rows[0].count);
      let query = `SELECT * FROM goods`;
      const parameters = [req.query.offset || 0, req.query.limit || 10];
      if (req.query.search) {
        query += ` ${selection} $3`;
        parameters.push(`%${req.query.search}%`);
      }
      if (
        req.query.sort &&
        ["ASC", "DESC"].includes(req.query.order?.toUpperCase())
      ) {
        query += ` ORDER BY ${req.query.sort} ${req.query.order}`;
      } else {
        query += " ORDER BY id";
      }
      query += " OFFSET $1 LIMIT $2";
      getClient().query(query, parameters, (err, data) => {
        if (err) {
          res.status(400).json({ error: err.message });
        } else {
          res.json({ total, data: data.rows });
        }
      });
    }
  );
});

router.post("/", (req, res) => {
  const parameters = [req.body.name, req.body.serial];
  getClient().query(
    "INSERT INTO goods (name,serial) VALUES ($1,$2) RETURNING *",
    parameters,
    (err, data) => {
      if (err) {
        res.status(400).json({ error: err.message });
      } else {
        res.json(data.rows[0]);
      }
    }
  );
});

router.put("/", (req, res) => {
  const parameters = [req.body.name, req.body.serial, req.body.id];
  getClient().query(
    "UPDATE goods SET name=$1,serial=$2 WHERE id=$3 RETURNING *",
    parameters,
    (err, data) => {
      if (err) {
        res.status(400).json({ error: err.message });
      } else {
        res.json(data.rows[0]);
      }
    }
  );
});

router.delete("/", (req, res) => {
  const parameters = [req.query.id];
  getClient().query(
    "DELETE FROM goods WHERE id=$1 RETURNING *",
    parameters,
    (err, data) => {
      if (err) {
        res.status(400).json({ error: err.message });
      } else {
        res.json(data.rows[0]);
      }
    }
  );
});

module.exports = router;
