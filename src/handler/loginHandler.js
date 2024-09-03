const qs = require("querystring");
const { login } = require("../controllers/loginController");
require("dotenv").config();

const loginDolphin = async (req, res) => {

    /*const { USER, PASSWORD } = process.env;
    const loginPayload = qs.stringify({
        vUser: USER,
        vPass: PASSWORD
    });*/
    try {
        const data = await login();
        if (data) {
            const logindata =
            {
                idempresa: data._idempresa,
                empresa: data._empresa,
                idusuario: data._idusuario,
                usuario: data._usuario,
                tipo: data._tipo,
                correo: data._correo,
                tiemporefresco: data._tiemporefresco
            };
            return res.status(200).json(logindata);
        }
        return res.status(404).json({ message: "error en la funcion login" });

    } catch (error) {
        console.error("error en el loginHandler :", error.message);
        return res.status(401).json({ message: error.message });
    }
}

module.exports = { loginDolphin };