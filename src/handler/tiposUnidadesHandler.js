const { getTipoUnidad } = require("../controllers/tiposUnidadesController");

const getTiposUnidades = async (req, res) => {

    try {
        const { data, status } = await getTipoUnidad();
        const tipos = {};
        if (status === 200 && data) {
            data.forEach((element) => {
                tipos[element.vchtundesc] = element.inttunidad;
            });
            return res.status(200).json(tipos);
        }
        return res.status(400).json({ message: "error al obtener los tipos de datos" });
    } catch (error) {
        console.error("Error al obtener tipos de unidades", error.message);
        return res.status(500).json({ message: "Error al obtener tipos de unidades: " + error.message });
    }
};

module.exports = { getTiposUnidades };