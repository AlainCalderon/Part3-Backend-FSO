const mongoose = require("mongoose");

let password = process.argv[2];
let name = process.argv[3];
let number = process.argv[4];

const dbUri = `mongodb+srv://ajcalderon171999:${password}@fso.0axpcoq.mongodb.net/?retryWrites=true&w=majority`;
mongoose.set("strictQuery", false);
mongoose.connect(dbUri);

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
} else if (process.argv.length === 3) {
  const personSchema = new mongoose.Schema({
    name: String,
    number: Number,
  });

  const Person = new mongoose.model("Person", personSchema);
  Person.find({}).then((res) => {
    console.log("Phonebook:");
    res.forEach((element) => {
      console.log(element.name, element.number);
    });
    mongoose.connection.close();
  });
} else {
  const personSchema = new mongoose.Schema({
    name: String,
    number: Number,
  });

  const Person = new mongoose.model("Person", personSchema);
  const person = new Person({
    name: name,
    number: number,
  });

  person.save().then((res) => {
    console.log("Saved record");
    mongoose.connection.close();
  });
}
