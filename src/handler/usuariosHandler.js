const { createUser, getAllUsers, getUser, deleteUser, updateUser, aproveUser, getAllPendingAprovals } = require("../controllers/usuariosController");
const { esAlfabetica } = require("../helpers/regex");

const createUserHandler = async (req, res) => {

    const { member, nombres, apellidos, telefono, dni, superior, turno } = req.body;
    const errors = [];

    if (!member)
        errors.push("El campo member es obligatorio");
    if (!nombres)
        errors.push("El campo nombres es obligatorio");
    if (!apellidos)
        errors.push("El campo apellidos es obligatorio");
    if (!telefono)
        errors.push("El campo telefono es obligatorio");
    if (!dni)
        errors.push("El campo dni es obligatorio");
    if (!superior)
        errors.push("El campo superior es obligatorio");
    if (!turno)
        errors.push("El campo turno es obligatorio");
    if (errors.length > 0)
        return res.status(400).json({ error: errors.join(", ") });

    try {
        const newUser = await createUser(member, nombres, apellidos, telefono, dni, superior, turno);
        if (newUser) {
            res.status(201).json({
                message: "Usuario creado correctamente",
                data: newUser
            });
        } else {
            res.status(400).json({
                message: "Error al crear el usuario",
                data: newUser
            });
        }

    } catch (error) {
        console.error("Error al crear el usuario:", error);
        return res.status(500).json({ message: "Error al crear el usuario" });
    }
};

const getUserHandler = async (req, res) => {

    const { member } = req.params;
    if (!member)
        return res.status(400).json({ message: "El campo member es obligatorio" });
    try {
        const user = await getUser(member);
        if (user) {
            res.status(200).json({
                message: "Usuario encontrado",
                data: user
            });
        } else {
            res.status(200).json({
                message: "Usuario no encontrado",
                data: null
            });
        }

    } catch (error) {
        console.error("Error al obtener el usuario:", error);
        return res.status(500).json({ message: "Error al obtener el usuario: " + error.message });
    }
};

const getAllUsersHandler = async (req, res) => {

    try {
        const users = await getAllUsers();
        if (users) {
            res.status(200).json({
                message: "Usuarios encontrados",
                data: users
            });
        } else {
            res.status(200).json({
                message: "No se encontraron usuarios",
                data: []
            });
        }

    } catch (error) {
        console.error("Error en getAllUsersHandler: ", error);
        return res.status(500).json({ message: "Error al obtener los usuarios:", error: error.message });
    }
};

const updateUserHandler = async (req, res) => {

    const { member } = req.params;
    const { nombres, apellidos, telefono, dni, turno, superior } = req.body;
    let errors = [];
    if (!member)
        errors.push("El campo member es obligatorio");
    if (!nombres)
        errors.push("El campo nombres es obligatorio");
    if (!esAlfabetica(nombres))
        errors.push("El campo nombres solo puede contener letras");
    if (!apellidos)
        errors.push("El campo apellidos es obligatorio");
    if (!esAlfabetica(apellidos))
        errors.push("El campo apellidos solo puede contener letras");
    if (!telefono)
        errors.push("El campo telefono es obligatorio");
    if (!Number.isInteger(telefono))
        errors.push("El campo telefono no puede contener letras");
    if (!dni)
        errors.push("El campo dni es obligatorio");
    if (!Number.isInteger(dni))
        errors.push("El campo dni no puede contener letras");
    if (!superior)
        errors.push("El campo superior es obligatorio");
    if (!esAlfabetica(superior))
        errors.push("El campo nombres solo puede contener letras");
    if (!turno)
        errors.push("El campo turno es obligatorio");
    if (!Number.isInteger(turno) || turno < 1 || turno > 3)
        errors.push("El campo turno debe ser un número representando el turno: mañana:1, tarde:2, noche:3");
    if (errors.length > 0)
        return res.status(400).json({ error: errors.join(", ") });
    try {
        const user = await getUser(member);
        if (user) {
            const response = await updateUser(user, nombres, apellidos, telefono, dni, turno, superior);
            if (response)
                return res.status(200).json({ data: response, message: "actualizado" });
            else
                return res.status(401).json({ message: "Error al actualizar el usuario, revisa los campos" });
        }
        return res.status(404).json({ message: "Error no se encontro el usuario" });
    } catch (error) {
        console.error("error en el updateUserHandler: ", error.message);
        return res.status(500).json({ message: "Error al actualizar el usuario" });
    }
};

const aproveUserHandler = async (req, res) => {

    const { member } = req.params;
    if (!member)
        return res.status(400).json({ message: "El campo member es obligatorio" });
    try {
        const response = await aproveUser(member);
        if (response[0] == 1) {
            res.status(200).json({
                message: "Usuario aprobado",
                data: member
            });
        } else {
            res.status(200).json({
                message: "Usuario no encontrado",
                data: member
            });
        }
    } catch (error) {
        console.error("Error al aprobar el usuario:", error);
        return res.status(500).json({ message: "Error al aprobar el usuario" });
    }
};

const getAllPendingAprovalsHandler = async (req, res) => {

    try {
        const response = await getAllPendingAprovals();
        if (response.length > 0)
            return res.status(200).json({ message: "Usuarios pendientes de aprobación", data: response });
        else
            return res.status(200).json({ message: "No hay usuarios pendientes de aprobación", data: [] });
    } catch (error) {
        console.error("Error al obtener los usuarios pendientes de aprobación:", error);
        return res.status(500).json({ message: "Error al obtener los usuarios pendientes de aprobación", error: error.message });
    }

};

const deleteUserHandler = async (req, res) => {
    const { member } = req.params;
    if (!member)
        return res.status(400).json({ message: "El campo member es obligatorio" });
    try {
        const response = await deleteUser(member);
        if (response) {
            return res.status(200).json({ message: "Usuario eliminado", data: response });
        } else {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
    } catch (error) {
        console.error("error en deleteUserHandler :", error.message);
        return res.status(500).json({ message: "deleteUserHandler: Error al obtener el usuario :", error: error.message });
    }
};

module.exports = { createUserHandler, getUserHandler, getAllUsersHandler, updateUserHandler, aproveUserHandler, getAllPendingAprovalsHandler, deleteUserHandler }