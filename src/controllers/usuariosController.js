const Usuario = require("../models/Usuario");
const Turno = require("../models/Turno");

const createUser = async (member, nombres, apellidos, telefono, dni, superior, turno) => {
    if (member && nombres && apellidos && telefono && dni)
        try {
            const newUser = await Usuario.create({ member, nombres, apellidos, telefono, dni, superior, turno });
            return newUser || null
        } catch (error) {
            console.error("Error creando usuario:", error);
            return false;
        }
    else
        return false;
};

const getAllUsers = async () => {

    try {
        const response = await Usuario.findAll({
            where: { state: true },
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
            const response = await Usuario.findOne({ where: { member: id, state: true }, include: [{ model: Turno, as: 'TurnoAsociado', attributes: ['nombre'] }] });
            return response || null;
        } catch (error) {
            console.error("Error al obtener el usuario:", id, error.message);
            return false;
        }
    else
        return false;
};

const updateUser = async (user, nombres, apellidos, telefono, dni, turno, superior) => {
    if (user) {
        try {
            const response = await user.update({ nombres, apellidos, telefono, dni, turno, superior });
            return response || null;
        } catch (error) {
            console.error("Error al actualizar el usuario:", error.message);
            return false;
        }
    }
    else
        return false;
};

const aproveUser = async (member) => {

    if (member) {
        try {
            const response = await Usuario.update({ state: true }, { where: { member } });
            return response || null;
        } catch (error) {
            console.error("Error al actualizar el usuario:", error.message);
            return false;
        }
    }
    else {
        console.error("No se envio member");
        return false;
    }

};

const getAllPendingAprovals = async () => {
    try {
        const response = await Usuario.findAll({
            where: {
                state: false
            },
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

const deleteUser = async (id) => {

    if (id) {
        try {
            const response = await Usuario.update({ state: false }, { where: { member: id } });
            return response || null;
        } catch (error) {
            console.error("Error al eliminar el usuario:", error.message);
            return false;
        }
    }
    else
        return false;
};

const validateUsuarioMovil = async (dni) => {
    try {
        console.log('dni en el controlador: ', dni)
        const user = await Usuario.findOne({ where: { dni: dni } })
        return user
    } catch (error) {
        return false
    }
}

module.exports = { createUser, getAllUsers, getUser, updateUser, deleteUser, aproveUser, getAllPendingAprovals, validateUsuarioMovil }