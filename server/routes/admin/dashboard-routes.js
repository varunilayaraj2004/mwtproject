const express = require("express");
const { getDashboardStats } = require("../../controllers/admin/dashboard-controller");
const { authMiddleware, adminMiddleware } = require("../../controllers/auth/auth-controller");

const router = express.Router();

router.get("/dashboard-stats", authMiddleware, adminMiddleware, getDashboardStats);

module.exports = router;
