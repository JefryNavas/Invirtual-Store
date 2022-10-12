const express = require("express");
const { login,admin } = require("../controller/login.controller");
const router = express.Router();

router.get("/", login);
router.get("/admin", admin);

module.exports = router;
