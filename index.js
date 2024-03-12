const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const path = require("path");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const { error } = require("console");
const database = require ("./database")

const upload = multer({ dest: "public" });
const app = express();
const port = 6000;

app.use(morgan("short"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.corsOptions = {
  origin: "http://localhost:3300",
};

// Get
app.get("/students", async (req, res) => {
  try {
    const result = await database.query("SELECT * FROM students");
    res.status(200).json({
      status: "success",
      data: result.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Post
app.post("/students", async (req, res) => {
  const { name, address } = req.body;
  try {
    const result = await database.query(
      `INSERT into students (name, address) values ('${name}', '${address}')`
    );
    res.status(200).json({
      status: "success",
      message: "data berhasil dimasukan",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Update
app.patch("/students/:id", async (req, res) => {
  const {id} = req.params;
  const {name, address} = req.body;
  try {
    const result = await database.query (`
    UPDATE public.students
	  SET name=${name}, address=${address}
	  WHERE id=${id}`);
    res.status(200).json({
      status: "success",
      message: "data berhasil diupdate",
      data: result.rows,
    });
  } catch (error) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Delete
app.delete("/students/:id", async (req, res) => {
  const {id} = req.params;
  try {
    const result = await database.query (`
    DELETE FROM students
  	WHERE id=${id}`);
    res.status(200).json({
      status: "success",
      message: "data berhasil dihapus",
    });
    } catch (error) {
      console.error(err);
      res.status(500).send("Internal Server Error");
  }
});

// Get by ID
app.get("/students/:id", async (req, res) => {
  const {id} = req.params;
  try {
    const result = await database.query(`SELECT * FROM students WHERE id=${id}`);
    res.status(200).json({
      status: "success",
      data: result.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});


app.listen(port, () => {
  console.log(`Server berjalan pada http://localhost:${port}`);
});
