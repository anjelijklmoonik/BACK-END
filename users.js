const express = require("express");
const morgan = require("morgan");

const app = express();

app.use(morgan("dev"));

const users = [
  {
    id: 1,
    name: "John",
  },
  {
    id: 2,
    name: "Smith",
  },
  {
    id: 3,
    name: "Bob",
  },
];

app.get("/users", (req, res) => {
  res.json(users);
});

app.get("/users/:name", (req, res) => {
  const name = req.params.name;

  const user = users.find(
    (user) => user.name.toLowerCase() === name.toLowerCase()
  );

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({
      message: "data user tidak di temukan",
    });
  }
});

app.use((req, res, next) => {
  res.status(404).json({
    status: "error",
    message: "resource tidak ditemukan",
  });
});

app.use((err, req, res, next) => {
  // Log the error
  console.error(err);

  res.status(500).json({
    status: "error",
    message: "terjadi kesalahan pada server",
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});