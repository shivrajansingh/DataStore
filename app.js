const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3001;
const { select, count, selectWithPagination } = require("./helper"); 
const { executeSQL } = require("./config"); 
// Middleware
app.use(bodyParser.json());
app.use(cors()); 

// Initialize SQLite Database
const db = new sqlite3.Database('./datastore.db');

// Helper function to create a table if it doesn't exist
const createTableIfNotExists = (table) => {
  return new Promise((resolve, reject) => {
    db.run(`CREATE TABLE IF NOT EXISTS ${table} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT UNIQUE,
      value LONGTEXT
    )`, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

// Homepage
app.get('/', (req, res) => {
  res.send('<h1>Welcome to DataStore</h1>');
});

// API to list all tables
app.get('/tables', (req, res) => {
  const query = `SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';`;

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    const tables = rows.map(row => row.name);
    res.json(tables);
  });
});

// API to get all keys
app.get('/:table/keys', async (req, res) => {
  const table = req.params.table;

  try {
    await createTableIfNotExists(table);

    db.all(`SELECT key FROM ${table}`, [], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      const keys = rows.map(row => row.key);
      res.json(keys);
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//get count
app.get('/:table/count', async (req, res) => {
  try {
    const { table } = req.params;
    const condition = req.query;
    const data = await count(table, condition);
    res.json({ count: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//get table data
app.get('/:table', async(req, res)=>{
  try{
      const { table } = req.params;
      const condition = req.query;
      const data = await select(table, condition);
      res.json(data);
  }catch (error) {
      res.status(500).json({ error: error.message });
    }
})

//get table data with pagination
app.get('/:table/page/:page', async (req, res) => {
  try {
    const { table, page } = req.params;
    const condition = req.query;
    const pageSize = 10; 
    const data = await selectWithPagination(table, condition, parseInt(page), pageSize);
    const totalRecords = await count(table); 
    const totalPages = Math.ceil(totalRecords/10); 
    let finalResponse = {
      data : data, 
      totalRecords : totalRecords,
      totalPages : totalPages
    }
    res.json(finalResponse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API to insert or update data
app.post('/:table', async (req, res) => {
  const table = req.params.table;
  const { key, value } = req.body;

  try {
    await createTableIfNotExists(table);

    const insertOrUpdate = `
      INSERT INTO ${table} (key, value) 
      VALUES (?, ?) 
      ON CONFLICT(key) DO UPDATE SET value=excluded.value
    `;
    db.run(insertOrUpdate, [key, value], function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, key, value });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
  
// API to retrieve data
app.get('/:table/:key', async (req, res) => {
  const table = req.params.table;
  const key = req.params.key;

  try {
    await createTableIfNotExists(table);

    db.get(`SELECT value FROM ${table} WHERE key = ?`, [key], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(row ? row.value : { error: 'Key not found' });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API to delete a table
app.delete('/:table', async (req, res) => {
    const table = req.params.table;
  
    try {
      db.run(`DROP TABLE IF EXISTS ${table}`, function (err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ message: `Table ${table} deleted` });
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

  
// API to delete data
app.delete('/:table/:key', async (req, res) => {
  const table = req.params.table;
  const key = req.params.key;

  try {
    await createTableIfNotExists(table);

    db.run(`DELETE FROM ${table} WHERE key = ?`, [key], function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ deleted: this.changes });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API to update data
app.put('/:table/:key', async (req, res) => {
  const table = req.params.table;
  const key = req.params.key;
  const { value } = req.body;

  try {
    await createTableIfNotExists(table);

    const update = `
      UPDATE ${table} SET value = ? WHERE key = ?
    `;
    db.run(update, [value, key], function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ updated: this.changes });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/sql', async (req, res) => {
  try {
    const { sql } = req.body;

    if (!sql) {
      return res.status(400).json({ error: 'SQL statement is required' });
    }

    const result = await executeSQL(sql);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`DataStore app listening at http://localhost:${port}`);
});
