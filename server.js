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

// Jalankan server
app.listen(3000, () => {
  console.log("CRUD API Vendor A berjalan di http://localhost:3000/vendorA");
});