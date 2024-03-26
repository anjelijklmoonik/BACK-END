const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const path = require("path");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const { error } = require("console");
const {prisma} = require ("./database")

const upload = multer({ dest: "public" });
const app = express();
const port = 6000;

app.use(morgan("short"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.corsOptions = {
  origin: "http://localhost:3300",
};

app.get("/students", async (req, res) => {
  try {
    const data = await prisma.students.findMany();
    res.status(200).json({
      status: "Success",
      data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/students", async (req, res) => {
  const { name, address } = req.body;
  try {
    if (!name || !address)
      return res.status(400).json({
        status: "Failed",
        message: "Nama dan alamat tidak diisi",
      });
    const data = await prisma.students.create({
      data: {
        name,
        address,
      },
    });
    res.status(200).json({
      status: "Success",
      message: "Data berhasil dimasukkan",
      data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Get Student by ID
app.get("/students/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const data = await prisma.students.findUnique({
      where: {
        id: parseInt(id, 10),
      },
    });
    res.status(200).json({
      status: "Success",
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

// Update Student by ID
app.patch("/students/:id", async (req, res) => {
  const { id } = req.params;
  const { name, address } = req.body;
  try {
    const data = await prisma.students.update({
      where: {
        id: parseInt(id, 10),
      },
      data: {
        name,
        address,
      },
    });
    res.status(200).json({
      status: "Success",
      message: "Update data berhasil",
      data,
    });
  } catch (error) {
    if (error.code === "P2025")
      return res.status(404).json({
        status: "Failed",
        message: "Data tidak ditemukan",
      });
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

// Delete Student by ID
app.delete("/students/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const data = await prisma.students.delete({
      where: {
        id: parseInt(id, 10),
      },
    });
    res.status(200).json({
      status: "Success",
      message: "Berhasil menghapus data",
      data,
    });
  } catch (error) {
    if (error.code === "P2025")
      return res.status(404).json({
        status: "Failed",
        message: "Data tidak ditemukan",
      });
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server berjalan pada http://localhost:${port}`);
});
