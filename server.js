import express from "express";
import fs from "fs";

const app = express();
app.use(express.json());

// Baca file JSON
function readData(path) {
  return JSON.parse(fs.readFileSync(path, "utf8"));
}

// Simpan lagi ke file JSON
function saveData(path, data) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

const vendorAPath = "./vendors/vendorA/vendorA.json";
const vendorBPath = "./vendors/vendorB/vendorB.json";
const vendorCPath = "./vendors/vendorC/vendorC.json";

// GET all
app.get("/vendorA", (req, res) => {
  const data = readData(vendorAPath);
  res.json(data);
});

// POST add
app.post("/vendorA", (req, res) => {
  const list = readData(vendorAPath);
  list.push(req.body);
  saveData(vendorAPath, list);

  res.json({
    pesan: "Data baru berhasil ditambahkan",
    data: list
  });
});

// PUT update
app.put("/vendorA/:id", (req, res) => {
  const list = readData(vendorAPath);
  const id = req.params.id;

  const index = list.findIndex(item => item.kd_produk == id);
  if (index === -1) {
    return res.status(404).json({ pesan: "Data tidak ditemukan" });
  }

  list[index] = { ...list[index], ...req.body };
  saveData(vendorAPath, list);

  res.json({
    pesan: "Data berhasil diupdate",
    data: list
  });
});

// DELETE
app.delete("/vendorA/:id", (req, res) => {
  let list = readData(vendorAPath);
  const id = req.params.id;

  list = list.filter(item => item.kd_produk != id);
  saveData(vendorAPath, list);

  res.json({
    pesan: "Data berhasil dihapus",
    data: list
  });
});

//VENDOR B 
app.get("/vendorB", (req, res) => {
  res.json(readJSON(vendorBPath));
});

app.post("/vendorB", (req, res) => {
  const data = readJSON(vendorBPath);
  data.push(req.body);
  writeJSON(vendorBPath, data);
  res.json({ message: "Berhasil tambah data Vendor B", data });
});

app.put("/vendorB/:sku", (req, res) => {
  let data = readJSON(vendorBPath);
  const sku = req.params.sku;

  const index = data.findIndex(item => item.sku == sku);
  if (index === -1) return res.status(404).json({ message: "Data tidak ditemukan" });

  data[index] = { ...data[index], ...req.body };
  writeJSON(vendorBPath, data);
  res.json({ message: "Berhasil update data Vendor B", data });
});

app.delete("/vendorB/:sku", (req, res) => {
  let data = readJSON(vendorBPath);
  const sku = req.params.sku;

  data = data.filter(item => item.sku != sku);
  writeJSON(vendorBPath, data);
  res.json({ message: "Berhasil hapus data Vendor B", data });
});

//VENDOR C
//all get
app.get("/vendorC", (req, res) => {
  const data = readJSON(vendorCPath);
  res.json(data);
});

//id get
app.get("/vendorC/:id", (req, res) => {
  const data = readJSON(vendorCPath);
  const item = data.find((i) => i.id == req.params.id);
  
  if (!item) return res.status(404).json({ message: "Data tidak ditemukan" });

  res.json(item);
});

//post
app.post("/vendorC", (req, res) => {
  const data = readJSON(vendorCPath);

  data.push(req.body); 
  writeJSON(vendorCPath, data);

  res.json({ message: "Produk berhasil ditambahkan!", data });
});

//put
app.put("/vendorC/:id", (req, res) => {
  let data = readJSON(vendorCPath);
  const id = req.params.id;

  const index = data.findIndex((i) => i.id == id);

  if (index === -1)
    return res.status(404).json({ message: "Produk tidak ditemukan" });

  data[index] = { ...data[index], ...req.body };
  writeJSON(vendorCPath, data);

  res.json({ message: "Produk berhasil diupdate!", data });
});

//delete
app.delete("/vendorC/:id", (req, res) => {
  let data = readJSON(vendorCPath);
  const id = req.params.id;

  const filtered = data.filter((i) => i.id != id);
  writeJSON(vendorCPath, filtered);

  res.json({ message: "Produk berhasil dihapus!", data: filtered });
});

// menjalankan server
app.listen(3000, () => {
  console.log("Server berjalan di http://localhost:3000");
});