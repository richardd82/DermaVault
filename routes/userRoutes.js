// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { User } = require('../models');
const auth = require('../middleware/auth'); // Middleware para validar JWT
const bcryptjs = require('bcryptjs');
const { Op } = require('sequelize');

// GET /api/users - Obtener todos los usuarios
router.get('/',  auth, async (req, res) => {
  try {
    // Podrías filtrar ciertos campos (por ejemplo, no mostrar password)
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    res.json(users);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
});

// GET /api/users/:id - Obtener un usuario por ID
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ message: 'Error al obtener usuario' });
  }
});

// POST /api/users - Crear un nuevo usuario
router.post('/', auth, async (req, res) => {
  try {
    const { username, email, password, role, first_name, last_name, is_active, last_login } = req.body;

    // Validar que username, email, password no vengan vacíos
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    // Verificar si username o email ya existen
    const existingUser = await User.findOne({
      where: { 
        [Op.or]: [{ username }, { email }] 
      }
    });
    if (existingUser) {
      return res.status(409).json({ message: 'Usuario o email ya existen' });
    }

    // Crear usuario
    const newUser = await User.create({
      username,
      email,
      password, // Se hashea en el hook beforeCreate (User.beforeCreate)
      role,
      first_name,
      last_name,
      is_active: is_active ?? true,
      last_login: last_login ?? null
    });

    // Excluir el campo password del response
    const { password: _, ...userData } = newUser.toJSON();
    res.status(201).json(userData);
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ message: 'Error al crear usuario' });
  }
});

// PUT /api/users/:id - Actualizar usuario existente
router.put('/:id', auth, async (req, res) => {
  try {
    const { username, email, password, is_active } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Actualizar campos
    if (username) user.username = username;
    if (email) user.email = email;
    if (typeof is_active !== 'undefined') user.is_active = is_active;

    // Para actualizar contraseña con hashing
    if (password) {
      const salt = await bcryptjs.genSalt(10);
      user.password = await bcryptjs.hash(password, salt);
    }

    await user.save();

    // Retornar sin el password
    const { password: _, ...userData } = user.toJSON();
    res.json(userData);
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ message: 'Error al actualizar usuario' });
  }
});

// DELETE /api/users/:id - Eliminar un usuario
router.delete('/:id', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    await user.destroy();
    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ message: 'Error al eliminar usuario' });
  }
});

module.exports = router;
