const express = require('express');
const path = require('path');
const { Pool } = require('pg'); 
const marketplaceRouter = require('./marketplace');

const app = express();
app.use(express.json());

//konfigurasi neon
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, 
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
});

app.get('/status', (req, res) => {
  res.json({ ok: true });
});

//vendor A
//get
app.get('/vendorA', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM vendor_a ORDER BY kd_produk ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching Vendor A data:', error);
    res.status(500).json({ message: 'Internal Server Error (DB Fetch A)' });
  }
});

//post
app.post('/vendorA', async (req, res) => {
  const { kd_produk, nama_produk, harga, stok } = req.body;
  
  if (!kd_produk || !nama_produk || !harga || !stok) {
      return res.status(400).json({ message: 'Data Vendor A tidak lengkap.' });
  }
  
  try {
    const queryText = `
      INSERT INTO vendor_a (kd_produk, nm_brg, hrg, ket_stok)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const result = await pool.query(queryText, [kd_produk, nama_produk, harga, stok]);
    res.status(201).json({ pesan: 'data ditambah', data: result.rows[0] });
  } catch (error) {
    console.error('Error inserting Vendor A item:', error);
    res.status(500).json({ message: 'Gagal menambahkan data (DB Insert A)' });
  }
});

//put
app.put('/vendorA/:id', async (req, res) => {
  const { id } = req.params; 
  const updates = req.body;

  const setClauses = [];
  const values = [];
  let index = 1;

  if (updates.nama_produk !== undefined) {
      setClauses.push(`nm_brg = $${index++}`);
      values.push(updates.nama_produk);
  }
  if (updates.harga !== undefined) {
      setClauses.push(`hrg = $${index++}`);
      values.push(updates.harga);
  }
  if (updates.stok !== undefined) {
      setClauses.push(`ket_stok = $${index++}`);
      values.push(updates.stok);
  }
  
  if (setClauses.length === 0) {
    return res.status(400).json({ message: 'Tidak ada data untuk diupdate' });
  }

  values.push(id);

  try {
    const queryText = `
      UPDATE vendor_a
      SET ${setClauses.join(', ')}
      WHERE kd_produk = $${index} 
      RETURNING *;
    `;
    const result = await pool.query(queryText, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'ga ada' });
    }
    res.json({ pesan: 'diupdate', data: result.rows[0] });
  } catch (error) {
    console.error('Error updating Vendor A item:', error);
    res.status(500).json({ message: 'Gagal update data (DB Update A)' });
  }
});

//delete
app.delete('/vendorA/:id', async (req, res) => {
  const { id } = req.params; 
  try {
    const result = await pool.query('DELETE FROM vendor_a WHERE kd_produk = $1 RETURNING *', [id]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'ga ada' });
    }

    res.json({ pesan: 'dihapus', data: result.rows[0] });
  } catch (error) {
    console.error('Error deleting Vendor A item:', error);
    res.status(500).json({ message: 'Gagal delete data (DB Delete A)' });
  }
});

//vendor b
//get
app.get('/vendorB', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM vendor_b ORDER BY sku ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching Vendor B data:', error);
    res.status(500).json({ message: 'Internal Server Error (DB Fetch B)' });
  }
});

//post
app.post('/vendorB', async (req, res) => {
  const { sku, product_name, price, is_available } = req.body;
  
  if (!sku || !product_name || price === undefined || is_available === undefined) {
      return res.status(400).json({ message: 'Data Vendor B tidak lengkap.' });
  }
  
  try {
    const queryText = `
      INSERT INTO vendor_b (sku, product_name, price, is_available)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const result = await pool.query(queryText, [sku, product_name, price, is_available]);
    res.status(201).json({ message: 'data ditambah', data: result.rows[0] });
  } catch (error) {
    console.error('Error inserting Vendor B item:', error);
    res.status(500).json({ message: 'Gagal menambahkan data (DB Insert B)' });
  }
});

//put
app.put('/vendorB/:sku', async (req, res) => {
  const { sku } = req.params;
  const updates = req.body;

  const setClauses = [];
  const values = [];
  let index = 1;

  if (updates.product_name !== undefined) {
      setClauses.push(`product_name = $${index++}`);
      values.push(updates.product_name);
  }
  if (updates.price !== undefined) {
      setClauses.push(`price = $${index++}`);
      values.push(updates.price);
  }
  if (updates.is_available !== undefined) {
      setClauses.push(`is_available = $${index++}`);
      values.push(updates.is_available);
  }

  if (setClauses.length === 0) {
    return res.status(400).json({ message: 'Tidak ada data untuk diupdate' });
  }

  values.push(sku);

  try {
    const queryText = `
      UPDATE vendor_b
      SET ${setClauses.join(', ')}
      WHERE sku = $${index} 
      RETURNING *;
    `;
    const result = await pool.query(queryText, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'ga ada' });
    }
    res.json({ message: 'updated', data: result.rows[0] });
  } catch (error) {
    console.error('Error updating Vendor B item:', error);
    res.status(500).json({ message: 'Gagal update data (DB Update B)' });
  }
});

//delete
app.delete('/vendorB/:sku', async (req, res) => {
  const { sku } = req.params;
  try {
    const result = await pool.query('DELETE FROM vendor_b WHERE sku = $1 RETURNING *', [sku]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'ga ada' });
    }

    res.json({ message: 'deleted', data: result.rows[0] });
  } catch (error) {
    console.error('Error deleting Vendor B item:', error);
    res.status(500).json({ message: 'Gagal delete data (DB Delete B)' });
  }
});

//vendor c
//get
app.get('/vendorC', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM vendor_c ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching Vendor C data:', error);
    res.status(500).json({ message: 'Internal Server Error (DB Fetch C)' });
  }
});

//get
app.get('/vendorC/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM vendor_c WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'ga ketemu' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching single Vendor C item:', error);
    res.status(500).json({ message: 'Internal Server Error (DB Fetch Single C)' });
  }
});

//post
app.post('/vendorC', async (req, res) => {
  const { details, pricing, stock } = req.body;
  
  const name = details?.name;
  const category = details?.category;
  const base_price = pricing?.base_price;
  const tax = pricing?.tax;

  if (!name || !base_price || stock === undefined) {
      return res.status(400).json({ message: 'Data Vendor C tidak lengkap.' });
  }
  
  try {
    const queryText = `
      INSERT INTO vendor_c (name, category, base_price, tax, stock)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const result = await pool.query(queryText, [name, category, base_price, tax, stock]);
    res.status(201).json({ message: 'ditambah', data: result.rows[0] });
  } catch (error) {
    console.error('Error inserting Vendor C item:', error);
    res.status(500).json({ message: 'Gagal menambahkan data (DB Insert C)' });
  }
});

//put
app.put('/vendorC/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const setClauses = [];
  const values = [];
  let index = 1;

  if (updates.details) {
      if (updates.details.name !== undefined) {
          setClauses.push(`name = $${index++}`);
          values.push(updates.details.name);
      }
      if (updates.details.category !== undefined) {
          setClauses.push(`category = $${index++}`);
          values.push(updates.details.category);
      }
  }
  if (updates.pricing) {
      if (updates.pricing.base_price !== undefined) {
          setClauses.push(`base_price = $${index++}`);
          values.push(updates.pricing.base_price);
      }
      if (updates.pricing.tax !== undefined) {
          setClauses.push(`tax = $${index++}`);
          values.push(updates.pricing.tax);
      }
  }
  if (updates.stock !== undefined) {
      setClauses.push(`stock = $${index++}`);
      values.push(updates.stock);
  }

  if (setClauses.length === 0) {
    return res.status(400).json({ message: 'Tidak ada data untuk diupdate' });
  }

  values.push(id); 

  try {
    const queryText = `
      UPDATE vendor_c
      SET ${setClauses.join(', ')}
      WHERE id = $${index} 
      RETURNING *;
    `;
    const result = await pool.query(queryText, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'ga ada' });
    }
    res.json({ message: 'updated', data: result.rows[0] });
  } catch (error) {
    console.error('Error updating Vendor C item:', error);
    res.status(500).json({ message: 'Gagal update data (DB Update C)' });
  }
});

//delete
app.delete('/vendorC/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM vendor_c WHERE id = $1 RETURNING *', [id]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'ga ada' });
    }

    res.json({ message: 'deleted', data: result.rows[0] });
  } catch (error) {
    console.error('Error deleting Vendor C item:', error);
    res.status(500).json({ message: 'Gagal delete data (DB Delete C)' });
  }
});

//route gabungan
app.use('/marketplace', marketplaceRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'ga ada' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('jalan di port ' + PORT);
});

module.exports = app;