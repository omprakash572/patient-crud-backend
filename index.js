const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json());

const PORT = 3000;
const DB_FILE = './data.json';

/* READ DATA */
app.get('/patients', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DB_FILE));
  res.json(data.patients);
});

/* CREATE DATA */
app.post('/patients', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DB_FILE));
  const newPatient = {
    id: Date.now(),
    ...req.body
  };
  data.patients.push(newPatient);
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  res.status(201).json(newPatient);
});

/* UPDATE DATA */
app.put('/patients/:id', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DB_FILE));
  const id = Number(req.params.id);

  const index = data.patients.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Patient not found" });
  }

  data.patients[index] = { ...data.patients[index], ...req.body };
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  res.json(data.patients[index]);
});

/* DELETE DATA */
app.delete('/patients/:id', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DB_FILE));
  const id = Number(req.params.id);

  data.patients = data.patients.filter(p => p.id !== id);
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  res.json({ message: "Patient deleted" });
});

app.listen(PORT, () => {
  console.log('Server running on http://localhost:${PORT})';
});