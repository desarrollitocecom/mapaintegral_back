const { getCamarasMunicipales, getCamarasVecinales } = require("../controllers/camarasController");

const getCamarasMunicipalesHandler = async (req, res) => {
    
    try {
        const data = await getCamarasMunicipales();
        if (data) {
            return res.status(200).json(data);
        } else {
            return res.status(400).json({ message: "Error obteniendo las cámaras municipales" });
        }
    } catch (error) {
        console.error("Error en getCamarasMunicipalesHandler:", error); // Loguea el error completo en la consola
        return res.status(500).json({ message: "Error al obtener las cámaras municipales: " + error.message });
    }
};

const getCamarasVecinalesHandler = async (req, res) => {
        
        try {
            const data = await getCamarasVecinales();
            if (data) {
                return res.status(200).json(data);
            } else {
                return res.status(400).json({ message: "Error obteniendo las cámaras vecinales" });
            }
        } catch (error) {
            console.error("Error en getCamarasVecinalesHandler:", error); // Loguea el error completo en la consola
            return res.status(500).json({ message: "Error al obtener las cámaras vecinales: " + error.message });
        }
    }

module.exports = { getCamarasMunicipalesHandler, getCamarasVecinalesHandler };
