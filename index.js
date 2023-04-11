require("dotenv").config();
console.log(process.env);
const express = require("express");
const app = express();
const Person = require("./models/person");
const morgan = require("morgan");
const cors = require("cors");

morgan.token("postData", (req, res) => {
  return JSON.stringify(req.body);
});

app.use(express.json());
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :postData "
  )
);
app.use(cors());
app.use(express.static("build"));
const PORT = process.env.PORT || 3001;

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (req, res) => {
  Person.find({})
    .then((personData) => {
      res.json(personData);
    })
    .catch((err) => console.log(err.message));
});

app.get("/info", (req, res) => {
  let count = persons.length;
  const date = new Date();
  res.send(`<p>Phonebook has ${count} people<br>${date} </p>`);
});

const generateId = () => {
  return Math.floor(Math.random() * 1000000);
};

app.post("/api/persons", (req, res) => {
  const body = req.body;

  Person.create({ name: body.name, number: parseInt(body.number) });
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((elem) => elem.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((elem) => elem.id !== id);
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Server is running in port ${PORT}`);
});
