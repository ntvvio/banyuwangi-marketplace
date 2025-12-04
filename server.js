// ===========================
//      IMPORT MODULE
// ===========================
const express = require('express');
const path = require('path');
const fs = require('fs');

// Import router marketplace
const marketplaceRouter = require('./marketplace');

const app = express();
app.use(express.json());


// ===========================
//  FUNGSI BACA & TULIS JSON
// ===========================
function readJSON(filePath) {
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
}

function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}


// ===========================
//      PATH VENDOR
// ===========================
const vendorAPath = path.join(__dirname, 'vendors', 'vendorA', 'vendorA.json');
const vendorBPath = path.join(__dirname, 'vendors', 'vendorB', 'vendorB.json');
const vendorCPath = path.join(__dirname, 'vendors', 'vendorC', 'vendorC.json');


// ===========================
//      STATUS API
// ===========================
app.get('/status', (req, res) => {
  res.json({ ok: true });
});


// ===========================
//          VENDOR A
// ===========================
app.get('/vendorA', (req, res) => {
  res.json(readJSON(vendorAPath));
});

app.post('/vendorA', (req, res) => {
  const list = readJSON(vendorAPath);
  list.push(req.body);
  writeJSON(vendorAPath, list);
  res.json({ pesan: 'data ditambah', data: list });
});

app.put('/vendorA/:id', (req, res) => {
  const list = readJSON(vendorAPath);
  const index = list.findIndex(item => item.kd_produk == req.params.id);

  if (index === -1) {
    return res.status(404).json({ pesan: 'gak ketemu' });
  }

  list[index] = { ...list[index], ...req.body };
  writeJSON(vendorAPath, list);
  res.json({ pesan: 'diupdate', data: list });
});

app.delete('/vendorA/:id', (req, res) => {
  let list = readJSON(vendorAPath);
  list = list.filter(item => item.kd_produk != req.params.id);
  writeJSON(vendorAPath, list);
  res.json({ pesan: 'dihapus', data: list });
});


// ===========================
//          VENDOR B
// ===========================
app.get('/vendorB', (req, res) => {
  res.json(readJSON(vendorBPath));
});

app.post('/vendorB', (req, res) => {
  const data = readJSON(vendorBPath);
  data.push(req.body);
  writeJSON(vendorBPath, data);
  res.json({ message: 'data ditambah', data });
});

app.put('/vendorB/:sku', (req, res) => {
  let data = readJSON(vendorBPath);
  const index = data.findIndex(item => item.sku == req.params.sku);

  if (index === -1) {
    return res.status(404).json({ message: 'ga ada' });
  }

  data[index] = { ...data[index], ...req.body };
  writeJSON(vendorBPath, data);
  res.json({ message: 'updated', data });
});

app.delete('/vendorB/:sku', (req, res) => {
  let data = readJSON(vendorBPath);
  data = data.filter(item => item.sku != req.params.sku);
  writeJSON(vendorBPath, data);
  res.json({ message: 'deleted', data });
});


// ===========================
//          VENDOR C
// ===========================
app.get('/vendorC', (req, res) => {
  res.json(readJSON(vendorCPath));
});

app.get('/vendorC/:id', (req, res) => {
  const data = readJSON(vendorCPath);
  const item = data.find(i => i.id == req.params.id);

  if (!item) return res.status(404).json({ message: 'ga ketemu' });
  res.json(item);
});

app.post('/vendorC', (req, res) => {
  const data = readJSON(vendorCPath);
  data.push(req.body);
  writeJSON(vendorCPath, data);
  res.json({ message: 'ditambah', data });
});

app.put('/vendorC/:id', (req, res) => {
  let data = readJSON(vendorCPath);
  const index = data.findIndex(i => i.id == req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: 'ga ada' });
  }

  data[index] = { ...data[index], ...req.body };
  writeJSON(vendorCPath, data);
  res.json({ message: 'updated', data });
});

app.delete('/vendorC/:id', (req, res) => {
  let data = readJSON(vendorCPath);
  data = data.filter(i => i.id != req.params.id);
  writeJSON(vendorCPath, data);
  res.json({ message: 'deleted', data });
});


// ===========================
//  ROUTER MARKETPLACE GABUNGAN
// ===========================
app.use('/marketplace', marketplaceRouter);


// ===========================
//     HANDLER 404
// ===========================
app.use((req, res) => {
  res.status(404).json({ error: 'ga ada' });
});


// ===========================
//        JALANKAN SERVER
// ===========================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('jalan di port ' + PORT);
});

module.exports = app;
