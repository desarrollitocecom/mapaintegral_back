const { getPuntosTacticos, getPuntoTacticoById, createPuntoTactico, updatePuntoTactico, deletePuntoTactico } = require("../controllers/puntosTacticosController.js");

const getPuntosTacticosHandler = async (req, res) => {
    try {
        const response = await getPuntosTacticos();
        if (!response.length) {
            return res.status(404).send({ message: "No se encontraron puntos tácticos" });
        }
        return res.status(200).send(response);
    } catch (error) {
        console.error("Se encontro error al obtener detalle de puntos tácticos", error.message);
        return res.status(500).send({ message: "Error al obtener detalle de puntos tácticos" });
    }
};

const getPuntoTacticoByIdHandler = async (req, res) => {
    const { id } = req.params;
    if (!id && !Number(id))
        return res.status(400).send({ message: "error en la deteccion del id del punto tactico" });
    try {
        const response = await getPuntoTacticoById(id);
        if (!response) {
            return res.status(404).send({ message: `No se encontró el punto táctico con ID ${id}` });
        }
        return res.status(200).json(response);
    } catch (error) {
        console.error(`Se encontró un error al obtener el punto táctico con ID ${id}:`, error.message);
        return res.status(500).send({ message: "Error al obtener detalle del punto táctico" });
    }
};

const createPuntoTacticoHandler = async (req, res) => {
    const { turno, nombre, zona, puntos } = req.body;
    const errors = [];
    if (!turno)
        errors.push("El campo turno es requerido");
    if (!nombre)
        errors.push("El campo nombre es requerido");
    if (!zona)
        errors.push("El campo zona es requerido");
    if (!puntos && typeof puntos !== "object")
        errors.push("El archivo geojson con los puntos es requerido");
    if (errors.length > 0)
        return res.status(400).send({ message: errors.join(", ") });

    try {
        const response = await createPuntoTactico(turno, nombre, zona, puntos);
        if (!response) {
            return res.status(400).send({ message: "No se pudo crear el punto táctico" });
        }
        return res.status(201).json(response);
    } catch (error) {
        console.error("Se encontró un error al crear un nuevo punto táctico:", error.message);
        return res.status(500).send({ message: "Error al crear un nuevo punto táctico" });
    }
};

const updatePuntoTacticoHandler = async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const errors = [];
    if (!data.turno && !Number(data.turno))
        errors.push("campo turno no detectado")
    if(!data.nombre)
        errors.push("campo nombre no detectado")
    if(!data.zona)
        errors.push("campo zona no detectado")
    if(!data.puntos)
        errors.push("el archivo geojson tiene problemas o no fue detectado")
    //const {turno,nombre,zona,puntos} = req.body;
    try {
        const response = await updatePuntoTactico(id, data);
        if (!response) {
            return res.status(404).send({ message: `No se pudo actualizar el punto táctico con ID ${id}` });
        }
        return res.status(200).json(response);
    } catch (error) {
        console.error(`Se encontró un error al actualizar el punto táctico con ID ${id}:`, error.message);
        return res.status(500).send({ message: "Error al actualizar el punto táctico" });
    }
};

const deletePuntoTacticoHandler = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await deletePuntoTactico(id);
        if (!response) {
            return res.status(404).send({ message: `No se pudo eliminar el punto táctico con ID ${id}` });
        }
        return res.status(200).send({ message: `Punto táctico con ID ${id} eliminado exitosamente.` });
    } catch (error) {
        console.error(`Se encontró un error al eliminar el punto táctico con ID ${id}:`, error.message);
        return res.status(500).send({ message: "Error al eliminar el punto táctico" });
    }
};

module.exports = {
    getPuntosTacticosHandler,
    getPuntoTacticoByIdHandler,
    createPuntoTacticoHandler,
    updatePuntoTacticoHandler,
    deletePuntoTacticoHandler,
};