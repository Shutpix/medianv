const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// Create employee
router.post('/', async (req, res) => {
  try {
    const { employeeCode, name, age, phone, address } = req.body;

    // Basic required field check
    if (!employeeCode || !name || age == null || !phone || !address) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check duplicate employeeCode
    const existing = await Employee.findOne({ employeeCode });
    if (existing) {
      return res.status(409).json({ message: 'employeeCode already exists' });
    }

    // Create employee (Mongoose validations run here)
    const employee = new Employee({
      employeeCode,
      name,
      age,
      phone,
      address
    });

    await employee.save();

    return res.status(201).json(employee);

  } catch (err) {
    console.error(err);

    // ✅ Mongoose validation errors (age / phone)
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ errors });
    }

    return res.status(500).json({ message: 'Server error' });
  }
});


// Read all employees
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    return res.json(employees);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Update phone and address by employeeCode (employeeId)
router.patch('/:employeeCode', async (req, res) => {
  try {
    const { employeeCode } = req.params;

    // ❌ Block restricted fields
    if (req.body.name || req.body.employeeCode) {
      return res.status(400).json({
        message: "You cannot update employeeCode or name"
      });
    }

    const updates = {};

    // ✅ Allow only phone & address
    if (req.body.phone) updates.phone = req.body.phone;
    if (req.body.address) updates.address = req.body.address;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "Nothing to update. Only phone and address allowed."
      });
    }

    const employee = await Employee.findOneAndUpdate(
      { employeeCode },
      { $set: updates },
      {
        new: true,
        runValidators: true // 🔥 IMPORTANT
      }
    );

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    return res.json(employee);

  } catch (err) {
    console.error(err);

    // ✅ Catch phone validation error
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ errors });
    }

    return res.status(500).json({ message: "Server error" });
  }
});


// Delete by employeeCode
router.delete('/:employeeCode', async (req, res) => {
  try {
    const { employeeCode } = req.params;
    const employee = await Employee.findOneAndDelete({ employeeCode });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    return res.json({ message: 'Employee deleted', employee });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
