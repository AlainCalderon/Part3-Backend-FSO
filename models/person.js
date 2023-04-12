const mongoose = require("mongoose");

const uri = process.env.MONGODB_URI;

mongoose
  .connect(uri)
  .then((res) => console.log("Conneted to DB"))
  .catch((err) => console.log(err.message));

const personSchema = new mongoose.Schema({
  name: { type: String, minLength: 3 },
  number: Number,
});

personSchema.set("toJSON", {
  transform: (doc, returnObject) => {
    returnObject.id = returnObject._id.toString();
    delete returnObject._id;
    delete returnObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
