const express = require("express");

const {
  handleImageUpload,
  addProduct,
  editProduct,
  fetchAllProducts,
  deleteProduct,
} = require("../../controllers/admin/products-controller");

const { upload } = require("../../helpers/cloudinary");

const { authMiddleware, adminMiddleware } = require("../../controllers/auth/auth-controller");

const router = express.Router();

router.post("/upload-image", authMiddleware, adminMiddleware, upload.single("my_file"), handleImageUpload);
router.post("/add", authMiddleware, adminMiddleware, addProduct);
router.put("/edit/:id", authMiddleware, adminMiddleware, editProduct);
router.delete("/delete/:id", authMiddleware, adminMiddleware, deleteProduct);
router.get("/get", authMiddleware, adminMiddleware, fetchAllProducts);

module.exports = router;
