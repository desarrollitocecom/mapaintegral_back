const Usuario = require("../models/Usuario");
const Turno = require("../models/Turno");

const createUser = async (member, nombres, apellidos, telefono, dni, superior, turno) => {
    if (member && nombres && apellidos && telefono && dni)
        try {
            const newUser = await Usuario.create({ member, nombres, apellidos, telefono, dni, superior, turno });
            return newUser || null
        } catch (error) {
            console.error("Error creando usuario:", error.message);
            return false;
        }
    else
        return false;
};

const getAllUsers = async () => {

    try {
        const response = await Usuario.findAll({
            include: [
                {
                    model: Turno,
                    as: 'TurnoAsociado',  // Usa el alias correcto
                    attributes: ['nombre']
                }
            ]
        });
        return response || [];
    } catch (error) {
        console.error("Error al obtener todos los usuarios:", error.message);
        return false;
    }
};

const getUser = async (id) => {

    if (id)
        try {
            const response = await Usuario.findOne({ where: { member: id }, include: [{ model: Turno, as: 'TurnoAsociado', attributes: ['nombre'] }] });
            return response || null;
        } catch (error) {
            console.error("Error al obtener el usuario:", id, error.message);
            return false;
        }
    else
        return false;
};

const updateUser = async (id, member, nombres, apellidos, telefono, dni) => {

    if (id) {
        try {
            const response = await id.update(member, nombres, apellidos, telefono, dni);
            return response || null;
        } catch (error) {
            console.error("Error al actualizar el usuario:", id, error.message);
            return false;
        }
    }
    else
        return false;
};

const deleteUser = async (id) => {

    if (id) {
        try {
            const response = await Usuario.destroy({ where: { member: id } });
            return response || null;
        } catch (error) {
            console.error("Error al eliminar el usuario:", id, error.message);
            return false;
        }
    }
    else
        return false;
};

module.exports = { createUser, getAllUsers, getUser, updateUser, deleteUser }