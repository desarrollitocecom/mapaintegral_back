const { getEstadosRadio } = require("../controllers/estadosController");

const { GPS_LISTAR_ESTADOS } = process.env;

const getEstados = async (req, res) => {
    try {
        const { data, status } = await getEstadosRadio();
        const estados = {};
        if (status === 200 && data) {
            data.forEach((element, key) => {
                estados[key] = element.upper;
            });
            return res.status(200).json(estados);
        }
        return res.status(400).json({ message: "error en la peticion de estados" });
    } catch (error) {
        console.error('Error en la solicitud :', error.message);
        return res.status(500).json({ message: error.message });
    }
};

module.exports = { getEstados };