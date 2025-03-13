const bcrypt = require('bcryptjs');

const password = '123456789'; // Aquí la contraseña que deseas hashear
const hashedPassword = bcrypt.hashSync(password, 10);

console.log('Contraseña hasheada:', hashedPassword);
