const express = require("express");
const userController = require("../controllers/userController");


const router = express.Router();

router.get("/users", userController.getAllUsers);
router.get("/roles", userController.getAllRoles);
router.put("/users/role", userController.updateRole);
router.put("/users/assign", userController.assignMember);

module.exports = router;
