const express = require("express");
const fs = require("fs");

const router = express.Router();

function readJSON(path) {
  return JSON.parse(fs.readFileSync(path, "utf-8"));
}

// Baca data vendor
const vendorA = readJSON("./vendors/vendorA/vendorA.json");
const vendorB = readJSON("./vendors/vendorB/vendorB.json");
const vendorC = readJSON("./vendors/vendorC/vendorC.json");

// Endpoint vendor
router.get("/vendorA", (req, res) => {
  res.json(vendorA);
});

router.get("/vendorB", (req, res) => {
  res.json(vendorB);
});

router.get("/vendorC", (req, res) => {
  res.json(vendorC);
});

// Endpoint marketplace gabungan
router.get("/", (req, res) => {
  res.json({
    vendorA,
    vendorB,
    vendorC
  });
});

module.exports = router;
