const express = require("express");
const router = express.Router();
const FormData = require("form-data");
const fs = require("fs");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// POST /api/tryon
router.post("/", async (req, res) => {
  try {
    const { person, cloth } = req.files || {};

    if (!person || !cloth) {
      return res.status(400).json({ error: "Please provide both person and cloth images." });
    }

    const formData = new FormData();
    formData.append("person", fs.createReadStream(person.tempFilePath || person.path));
    formData.append("cloth", fs.createReadStream(cloth.tempFilePath || cloth.path));

    // 🧠 Replace this with your actual ngrok URL
    const ngrokUrl = process.env.VTON_API_URL || "https://your-ngrok-url.ngrok-free.app/tryon";

    const response = await fetch(ngrokUrl, {
      method: "POST",
      body: formData,
      headers: formData.getHeaders(),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("❌ VTON model error:", text);
      return res.status(500).json({ error: "VTON model failed", details: text });
    }

    // Return image directly
    const buffer = await response.arrayBuffer();
    res.setHeader("Content-Type", "image/jpeg");
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error("❌ Try-On proxy error:", error);
    res.status(500).json({ error: "Failed to connect to the VTON model" });
  }
});

module.exports = router;
