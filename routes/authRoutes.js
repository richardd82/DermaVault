const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// POST /api/auth/login - Iniciar sesión
router.post('/login', async (req, res) => {  
  const { username, password } = req.body;
console.log(password, "ESTE ES MI PASSWORD")
  try {
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    const isValid = await user.validPassword(password);
    if (!isValid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      'tu_secreto_seguro', // Cambia esto por una variable segura en producción
      { expiresIn: '4h' }
    );

    res.json({ token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});
module.exports = router; 