const express = require("express");
const { getClient } = require("../db/client");
const router = express.Router();

router.post("/", (req, res) => {
  const { nip, name, email, phone, address } = req.body;

  if (!nip || !/^\d{12}$/.test(nip)) {
    res.status(400).json({ error: "Invalid NIP format" });
    return;
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ error: "Invalid email format" });
    return;
  }

  getClient().query(
    "INSERT INTO request (nip, name, email, phone, address) VALUES ($1, $2, $3, $4, $5) RETURNING id",
    [nip, name, email, phone, address],
    (err, result) => {
      if (err) {
        if (err.code === "23505") {
          if (err.constraint === "unique_nip") {
            res
              .status(400)
              .json({ error: "This NIP is already registered in the system" });
          } else if (err.constraint === "unique_email") {
            res.status(400).json({
              error: "This email is already registered in the system",
            });
          } else {
            res.status(400).json({ error: "Unique constraint violation" });
          }
        } else {
          res.status(500).json({ error: err.message });
        }
      } else {
        res.status(201).json({ id: result.rows[0].id });
      }
    }
  );
});

router.get("/:nip", (req, res) => {
  getClient().query(
    "SELECT * FROM request WHERE nip = $1",
    [req.params.nip],
    (err, result) => {
      if (err) {
        res.status(400).json({ error: err.message });
      } else if (result.rows.length === 0) {
        res.status(404).json({ error: "Request not found" });
      } else {
        res.json(result.rows[0]);
      }
    }
  );
});

router.get("/", (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const offset = (page - 1) * limit;

  getClient().query(
    "SELECT COUNT(*) AS total FROM request",
    (err, countResult) => {
      if (err) {
        console.error("Error counting records:", err);
        res.status(500).json({ error: err.message });
        return;
      }

      const total = parseInt(countResult.rows[0].total, 10);

      getClient().query(
        "SELECT * FROM request ORDER BY createdate DESC LIMIT $1 OFFSET $2",
        [limit, offset],
        (err, dataResult) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }

          res.setHeader("Content-Type", "application/json");
          res.json({
            total,
            page,
            limit,
            rowCount: dataResult.rowCount,
            data: dataResult.rows,
          });
        }
      );
    }
  );
});

router.put("/:nip", (req, res) => {
  const { status, notes } = req.body;

  getClient().query("BEGIN", async (err) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    try {
      let query = "UPDATE request SET status = $1";
      let values = [status, req.params.nip];
      let queryIndex = 2;

      if (notes !== undefined) {
        query += `, notes = $${++queryIndex}`;
        values.push(notes);
      }

      query += " WHERE nip = $2 RETURNING *";

      const result = await getClient().query(query, values);

      if (result.rows.length === 0) {
        await getClient().query("ROLLBACK");
        res.status(404).json({ error: "Request not found" });
        return;
      }

      if (status === 2) {
        try {
          await getClient().query(
            "INSERT INTO merchant (nip, request_id) VALUES ($1, $2)",
            [result.rows[0].nip, result.rows[0].id]
          );
        } catch (merchantErr) {
          await getClient().query("ROLLBACK");
          res.status(400).json({
            error:
              "Failed to create merchant entry. The NIP may already exist.",
            details: merchantErr.message,
          });
          return;
        }
      }

      await getClient().query("COMMIT");
      res.json(result.rows[0]);
    } catch (queryErr) {
      await getClient().query("ROLLBACK");
      res.status(400).json({ error: queryErr.message });
    }
  });
});

module.exports = router;
