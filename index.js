//all imports start here
require("dotenv").config();

const express = require("express");
const app = express();
const Person = require("./models/person");
const morgan = require("morgan");
const cors = require("cors");

//Start of code
app.use(express.static("build"));
app.use(express.json());
morgan.token("postData", (req, res) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :postData "
  )
);
app.use(cors());

const PORT = process.env.PORT || 3001;

//Error handlers
const idError = (err, req, res, next) => {
  console.log(err.message);
  if (err.name === "CastError") {
    return res.status(400).send({ error: "Problem with ID" });
  } else if (err.name === "ValidationError") {
    return res.status(400).send({ error: err.message });
  }
  next(err);
};

app.use(idError);

const errorHandler = (err, req, res, next) => {
  console.log(err.message);
  res.status(500).end();
};

app.use(errorHandler);

//Routes
app.get("/api/persons", (req, res) => {
  Person.find({})
    .then((personData) => {
      res.json(personData);
    })
    .catch((err) => console.log(err.message));
});

app.get("/info", (req, res) => {
  const date = new Date();
  Person.find({}).then((personData) => {
    let count = personData.length;
    res.send(`<p>Phonebook has ${count} people<br>${date} </p>`);
  });
});

app.post("/api/persons", (req, res) => {
  const body = req.body;
  Person.create({ name: body.name, number: parseInt(body.number) })
    .then((result) => {
      console.log(result);
    })
    .catch((err) => next(err));
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  Person.findById(id)
    .then((personId) => {
      res.json(personId);
    })
    .catch((err) => next(err));
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  Person.findByIdAndRemove(id)
    .then((result) => {
      console.log(`Deleted ${id}`);
      res.status(204).end();
    })
    .catch((err) => {
      next(err);
    });
});

app.put("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  console.log(req.body);
  let newNumber = {
    name: req.body.name,
    number: req.body.number,
  };

  Person.findByIdAndUpdate(id, newNumber, {
    runValidators: true,
    context: "query",
  })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      next(err);
    });
});

app.listen(PORT, () => {
  console.log(`Server is running in port ${PORT}`);
});
