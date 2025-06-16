const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;
const DATA_FILE = __dirname + "/../data/users.json";

app.use(cors());
app.use(bodyParser.json());

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  const users = JSON.parse(fs.readFileSync(DATA_FILE));
  users.push({ name, email, password, notes: [] });
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
  res.sendStatus(200);
});

app.post("/note", (req, res) => {
  const { email, note } = req.body;
  const users = JSON.parse(fs.readFileSync(DATA_FILE));
  const user = users.find(u => u.email === email);
  if (!user) return res.status(404).send("Usuário não encontrado");
  user.notes.push(note);
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
  res.sendStatus(200);
});

app.listen(PORT, () => console.log("Servidor rodando em http://localhost:" + PORT));