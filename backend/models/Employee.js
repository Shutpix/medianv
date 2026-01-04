const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema(
  {
    employeeCode: { type: String, required: true, unique: true }, 
    name: { type: String, required: true },
    age: {
      type: Number,
      required: true,
      min: [23, "Age must be at least 23"],
    },
    phone: {
      type: String,
      required: true,
      match: [/^[0-9]{10}$/, "Phone number must be exactly 10 digits"],
    },
    address: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", EmployeeSchema);
