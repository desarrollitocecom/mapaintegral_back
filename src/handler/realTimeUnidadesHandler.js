const qs = require("qs");
const cache = require("../cache");
const { getRealTimeUnidades } = require("../controllers/realTimeUnidadesController");
const { getRadios } = require("../controllers/radiosController");

const getRealTimeUnidadesHandler = async (req, res) => {
    const { type, state, orden, issi } = req.body;
    try {
        if (cache.get("sesion")) {
            const unidadespayload = qs.stringify({
                vidusuario: cache.get("sesion")._idusuario,
                vidtipo: type,
                videstado: state,
                vtipousuario: cache.get("sesion")._tipo,
                vorden: orden,
                vissi: issi
            });
            const { data, status } = await getRealTimeUnidades(unidadespayload);
            const conteo = {
                TODOS: {
                    activo: 0,
                    inactivo: 0
                },
                PERSONA: {
                    activo: 0,
                    inactivo: 0
                },
                AMBULANCIA: {
                    activo: 0,
                    inactivo: 0
                },
                AUTOMOVIL: {
                    activo: 0,
                    inactivo: 0
                },
                MOTO: {
                    activo: 0,
                    inactivo: 0
                },
                POLICIA: {
                    activo: 0,
                    inactivo: 0
                },
                CAMION: {
                    activo: 0,
                    inactivo: 0
                }
            };
            if (status === 200) {
                const issi_muni = await getRadios();
                const result = data.map((element) => {
                    const unidad = issi_muni.find((e) => element._issi === e.issi);
                    const estado = element._estado;
                    const tipoIssi = element._tipounid;
                    switch (estado) {
                        case "NORMAL":
                            conteo[tipoIssi].activo++;
                            break;
                        case "BATERIA BAJA":
                            conteo[tipoIssi].activo++;
                            break;
                        case "NO REPORTA - MAL APAGADO":
                            //conteo[tipoIssi].inactivo++;
                            break;
                        case "SIN COBERTURA DE GPS":
                            //conteo[tipoIssi].inactivo++;
                            break;
                        default:
                            break;
                    }
                    return {
                        _issi: element._issi,
                        _unicocodigo: element._unicocodigo,
                        _idtunidad: element._idtunidad,
                        _tipounid: element._tipounid,
                        _estadocod: element._estadocod,
                        _estado: element._estado,
                        _estadoradar: element._estadoradar,
                        _color: element._color,
                        _hexacolor: element._hexacolor,
                        _longitud: element._longitud,
                        _latitud: element._latitud,
                        _fechahora: element._fechahora,
                        _velocidad: element._velocidad,
                        _direccion: element._direccion,
                        _unidad: unidad ? unidad.informacion?.unidad : "-",
                        _placa: unidad ? unidad.informacion?.placa : "-",
                        _cargo: unidad ? unidad.informacion?.cargo : "-",
                        _nombre: unidad ? unidad.informacion?.nombre : "-"
                    }
                });
                return res.status(200).json({ result, conteo });
            }
            else
                return res.status(200).json({ message: "No se encontraron unidades disponibles revisa los datos del login"});
        }
    } catch (error) {
        console.error("error en Real Time Unidades :", error.message);
        return res.status(500).json({ message: error.message });
    }
};

module.exports = { getRealTimeUnidadesHandler };