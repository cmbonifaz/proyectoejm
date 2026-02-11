// CRUD DE MEDICAMENTOS
const Medicamento = require('../models/Medicamento');

// GET
async function getAllMedicamentos(req, res) {
    try {
        const medicamentos = await Medicamento.find();
        res.json(medicamentos);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching medications', error: error.message });
    }
}

// POST
async function addNewMedicamento(req, res) {
    const { name, description, price, quantity, category, laboratory } = req.body;

    // Validación básica de entrada
    if (!name || !description || !price || !quantity || !category || !laboratory) {
        return res.status(400).json({ message: 'Name, Description, Price, Quantity, Category and Laboratory are required' });
    }

    try {
        // Creamos un objeto medicamento
        const newMedicamento = new Medicamento({
            name,
            description,
            price,
            quantity,
            category,
            laboratory,
        });

        // Lo guardamos en la base de datos
        await newMedicamento.save();

        // Respondemos con el medicamento creado
        res.status(201).json(newMedicamento);
    } catch (error) {
        res.status(500).json({ message: 'Error creating medication', error: error.message });
    }
}

// PUT
async function updateMedicamento(req, res) {
    const { id } = req.params;
    const updateData = {};

    // Only include fields that are provided
    if (req.body.name !== undefined) updateData.name = req.body.name;
    if (req.body.description !== undefined) updateData.description = req.body.description;
    if (req.body.price !== undefined) updateData.price = req.body.price;
    if (req.body.quantity !== undefined) updateData.quantity = req.body.quantity;
    if (req.body.category !== undefined) updateData.category = req.body.category;
    if (req.body.laboratory !== undefined) updateData.laboratory = req.body.laboratory;

    try {
        const medicamento = await Medicamento.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true },
        );

        if (!medicamento) {
            return res.status(404).json({ message: 'Medicamento not found' });
        }

        res.json(medicamento);
    } catch (error) {
        res.status(500).json({ message: 'Error updating medication', error: error.message });
    }
}

// DELETE
async function deleteMedicamento(req, res) {
    const { id } = req.params;

    try {
        const medicamento = await Medicamento.findByIdAndDelete(id);
        if (!medicamento) {
            return res.status(404).json({ message: 'Medicamento not found' });
        }

        res.json(medicamento);
    } catch (error) {
        res.status(500).json({ message: 'Error deleting medication', error: error.message });
    }
}

module.exports = { getAllMedicamentos, addNewMedicamento, updateMedicamento, deleteMedicamento };
