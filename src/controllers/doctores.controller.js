// CRUD OF DOCTORS
const Doctor = require('../models/Doctor');

// GET - List all doctors
async function getAllDoctors(req, res) {
    try {
        const doctors = await Doctor.find();
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching doctors', error: error.message });
    }
}

// POST - Add new doctor
async function addNewDoctor(req, res) {
    const { name, lastName, specialty, phone, email, licenseNumber } = req.body;

    // Validate required fields
    if (!name || !lastName || !specialty || !phone || !email || !licenseNumber) {
        return res.status(400).json({
            message: 'Name, Last Name, Specialty, Phone, Email and License Number are required',
        });
    }

    try {
        // Validation: Do not allow doctors with the same license number
        const existingDoctor = await Doctor.findOne({ licenseNumber });
        if (existingDoctor) {
            return res.status(409).json({
                message: 'A doctor with this license number already exists',
            });
        }

        // Create doctor object
        const newDoctor = new Doctor({
            name,
            lastName,
            specialty,
            phone,
            email,
            licenseNumber,
        });

        // Save to database
        await newDoctor.save();

        // Respond with created doctor
        res.status(201).json(newDoctor);
    } catch (error) {
        // Handle MongoDB duplicate key error (E11000)
        if (error.code === 11000) {
            return res.status(409).json({
                message: 'A doctor with this license number already exists',
            });
        }
        res.status(500).json({ message: 'Error creating doctor', error: error.message });
    }
}

// PUT - Update doctor
async function updateDoctor(req, res) {
    const { id } = req.params;
    const { name, lastName, specialty, phone, email, licenseNumber } = req.body;

    try {
        const doctor = await Doctor.findById(id);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        // If attempting to update license number, verify it doesn't exist in another doctor
        if (licenseNumber !== undefined && licenseNumber !== doctor.licenseNumber) {
            const existingDoctor = await Doctor.findOne({ licenseNumber, _id: { $ne: id } });
            if (existingDoctor) {
                return res.status(409).json({
                    message: 'A doctor with this license number already exists',
                });
            }
        }

        // Update fields
        if (name !== undefined) doctor.name = name;
        if (lastName !== undefined) doctor.lastName = lastName;
        if (specialty !== undefined) doctor.specialty = specialty;
        if (phone !== undefined) doctor.phone = phone;
        if (email !== undefined) doctor.email = email;
        if (licenseNumber !== undefined) doctor.licenseNumber = licenseNumber;

        await doctor.save();
        res.json(doctor);
    } catch (error) {
        // Handle MongoDB duplicate key error (E11000)
        if (error.code === 11000) {
            return res.status(409).json({
                message: 'A doctor with this license number already exists',
            });
        }
        res.status(500).json({ message: 'Error updating doctor', error: error.message });
    }
}

// DELETE - Delete doctor
async function deleteDoctor(req, res) {
    const { id } = req.params;

    try {
        const doctor = await Doctor.findByIdAndDelete(id);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        res.json(doctor);
    } catch (error) {
        res.status(500).json({ message: 'Error deleting doctor', error: error.message });
    }
}

module.exports = { getAllDoctors, addNewDoctor, updateDoctor, deleteDoctor };
