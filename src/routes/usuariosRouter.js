const { Router } = require("express");
const router = Router();
const { createUserHandler, getAllUsersHandler, getUserHandler } = require("../handler/usuariosHandler");

router.get("/", getAllUsersHandler);
router.get("/:member", getUserHandler);
router.post("/", createUserHandler);
//router.put("/:id",)


module.exports = router;
