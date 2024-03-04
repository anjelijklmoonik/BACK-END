const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const path = require("path");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const users = require("./users");
const { error } = require("console");

const upload = multer({ dest: "public" });
const app = express();
const port = 6000;

app.use(morgan("short"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/users", (req, res) => {
  res.json({
    status: "ok",
    data: users,
  });
});

app.get("/users/:name", (req, res) => {
  const name = req.params.name;
  const user = users.find(
    (user) => user.name.toLowerCase() === name.toLowerCase()
  );
  if (user) {
    res.json ({
      status: "ok",
      data: user,
    });
  } else {
    res.status (404).json({
      status: "not found",
    });
  }
});

app.post("/users", (req, res) => {
  const payload = req.body;
  try {
    if (!payload?.id || !payload?.name) {
      throw new Error("Masukkan data yang akan diubah:");
    }
    const newUser = {
      id: users.length+1,
      name: payload.username,
      password: payload.password,
    };
    users.push(newUser);
    res.json({
      status: "ok",
      data: users,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
});

app.post("/upload", upload.single ("file"), (req, res) => {
  const file = req.file;
  if (file) {
    const target = path.join(__dirname, "public, file.originalname");
    fs.renameSync(file.path, target);
    res.json({
      status: "success",
      message: "upload file succeed",
      data: file,
    });
  } else {
    res.json({
      status: "error",
      message: "Masukkan data yang akan diubah",
    });
  }
});

app.put("/users/:name", (req, res) => {
  const name = req.params.name;
  const payload = req.body;
  try {
    if (!(!payload?.name || !payload?.id)) {
      throw new error("Masukkan data yang akan diubah:");
    }
    const user = users.find((user) =>
    user.name.toLowerCase() === name.toLowerCase());
    if (!user) {
      throw new error("Data user tidak ditemukan");
    }
    console.log(payload);

    if (payload.name) user.name = payload.name;
    if (payload.id) user.id = payload.id;
    console.log(user);
    res.json({
      status: "ok",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
});

app.delete("/users/:name", (req, res) => {
  const name = req.params.name;
  const user = users.find((user) =>
  user.name.toLowerCase() === name.toLowerCase());
  if (user) {
    users.splice(users.indexOf(user), 1);
    res.json({
      status: "ok",
      data: user,
    });
  } else {
    res.status(404).json({
      status: "tidak ditemukan",
    });
  }
});

app.use((_, res) => {
  res.status(404).json({
    status: "error",
    message: "resource not found",
  });
});

app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(404).json({
    status: "error",
    message: "server error",
  });
});

app.listen(port, () => {
  console.log(`Server berjalan pada http://localhost:${port}`);
});

