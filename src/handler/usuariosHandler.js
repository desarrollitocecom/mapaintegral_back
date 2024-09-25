const { createUser, getAllUsers, getUser, deleteUser, updateUser } = require("../controllers/usuariosController");

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
            res.status(404).json({
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
            res.status(404).json({
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

    const { id } = req.query;
    const { member, nombres, apellidos, telefono, dni } = req.body;
    try {
        const user = await getUser(member);
        if (user) {
            const response = await updateUser(member);
            if (response) {
                const update = updateUser(user, member, nombres, apellidos, telefono, dni);
            }
        }
    } catch (error) {

    }

};

module.exports = { createUserHandler, getUserHandler, getAllUsersHandler }