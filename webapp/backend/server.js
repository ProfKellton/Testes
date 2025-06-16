// backend/server.js
const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;
app.use(cors());
app.use(bodyParser.json());

const DATA_FILE = "data/users.json";

// Ensure data file exists
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify([]));

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  const users = JSON.parse(fs.readFileSync(DATA_FILE));
  users.push({ name, email, password, notes: [] });
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
  res.status(200).send("User registered");
});

app.post("/note", (req, res) => {
  const { email, note } = req.body;
  const users = JSON.parse(fs.readFileSync(DATA_FILE));
  const user = users.find(u => u.email === email);
  if (!user) return res.status(404).send("User not found");
  user.notes.push(note);
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
  res.status(200).send("Note added");
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));