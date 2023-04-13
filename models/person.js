const mongoose = require("mongoose");

const uri = process.env.MONGODB_URI;

mongoose
  .connect(uri)
  .then((res) => console.log("Conneted to DB"))
  .catch((err) => console.log(err.message));



const validator = (val) => {
  let numberPattern = /^\d{2,3}-\d{6,}/;
  return numberPattern.test(val);
};

const personSchema = new mongoose.Schema({
  name: { type: String, minlength: 3 },
  number: { type: String, validate: validator},
});

personSchema.set("toJSON", {
  transform: (doc, returnObject) => {
    returnObject.id = returnObject._id.toString();
    delete returnObject._id;
    delete returnObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
