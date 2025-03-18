const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { User } = require("../models");

// POST /api/auth/login - Iniciar sesión
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  // console.log(password, "ESTE ES MI PASSWORD")
  try {
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    const isValid = await user.validPassword(password);
    if (!isValid) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    user.last_login = new Date();
    await user.save();
    
    const token = jwt.sign(
      { id: user.id, username: user.username },
      "tu_secreto_seguro", // Cambia esto por una variable segura en producción
      { expiresIn: "4h" }
    );

    res.json({
      id: user.id, // <-- Asegúrate de incluirlo
      username: user.username,
      email: user.email,
      role: user.role,
      first_name: user.first_name,
      last_name: user.last_name,
      last_login: user.last_login,
      is_active: user.is_active,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});
module.exports = router;
