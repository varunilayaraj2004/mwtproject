const express = require("express");

const {
  addFeatureImage,
  getFeatureImages,
} = require("../../controllers/common/feature-controller");

const { authMiddleware, adminMiddleware } = require("../../controllers/auth/auth-controller");

const router = express.Router();

router.post("/add", authMiddleware, adminMiddleware, addFeatureImage);
router.get("/get", getFeatureImages);

module.exports = router;
