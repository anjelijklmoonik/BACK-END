const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const path = require("path");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const upload = multer({ dest: "public" });

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
// Request Body
app.use(bodyParser.json());
app.use(morgan("short"));
// File Static
app.use(express.static(path.join(__dirname, "public")));
// Cors
app.use(cors());
// File Upload
app.post("/uploads", upload.single('photo'), (req, res) => {
    const photo = req.file
  const user = req.body;
  const target = path.join(__dirname, "public", photo.originalname);
  if (photo){
    fs.renameSync(photo.path, target);
  }
  res.json({
    status: "success",
    message: "berhasil ditambahkan",
    data: user,
  });
});

app.use((_, res) => {
  res
    .status(404)
    .json({ status: "error", message: "resource tidak ada" });
});

app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ status: "error", message: "terjadi kesalahan pada server" });
});

app.listen(port, () => {
  console.log(`Server berjalan pada http://localhost:${port}`);
});
