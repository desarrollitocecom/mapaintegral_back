const { Router } = require("express");
const router = Router();
const { createUserHandler, getAllUsersHandler, getUserHandler, updateUserHandler, aproveUserHandler, getAllPendingAprovalsHandler } = require("../handler/usuariosHandler");

router.get("/", getAllUsersHandler);
router.get("/activate", getAllPendingAprovalsHandler);
router.get("/:member", getUserHandler);
router.post("/", createUserHandler);
router.put("/:member", updateUserHandler);
router.put("/activate/:member", aproveUserHandler);

module.exports = router;