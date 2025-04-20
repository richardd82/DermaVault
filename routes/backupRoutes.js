const express = require("express");
const { exec } = require("child_process");
const auth = require("../middleware/auth");
const path = require("path");
const router = express.Router();
const multer = require("multer");
const { spawn } = require("child_process");
const fs = require("fs");

router.post("/generate", auth, async (req, res) => {
  const user = process.env.MYSQLUSER;
  const password = process.env.MYSQL_ROOT_PASSWORD;
  const database = process.env.MYSQL_DATABASE;

  const timestamp = Date.now();
  const fileName = `backup-${timestamp}.sql`;
  const backupPath = path.join(__dirname, `../backups/${fileName}`);

  const dump = spawn("mysqldump", [`-u${user}`, `-p${password}`, database]);
  const output = fs.createWriteStream(backupPath);
  
  dump.stdout.pipe(output);
  dump.stderr.on("data", (data) => {
    console.error("❌ Error en mysqldump:", data.toString());
  });
  
  dump.on("close", (code) => {
    if (code === 0) {
      const fileName = path.basename(backupPath); // ← asegúrate de tener esto definido
      console.log("✅ Backup generado:", fileName);
  
      return res.json({
        success: true,
        message: "Respaldo generado exitosamente",
        fileName, // ← lo importante
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Error al generar respaldo",
      });
    }
  });
});
// router.post("/generate", auth, async (req, res) => {
//   const user = process.env.DB_USER;
//   const password = process.env.DB_PASSWORD;
//   const database = process.env.DB_NAME;

//   const timestamp = Date.now();
//   const backupPath = path.join(__dirname, `../backups/backup-${timestamp}.sql`);

//   const dump = spawn("mysqldump", [`-u${user}`, `-p${password}`, database]);

//   const output = fs.createWriteStream(backupPath);

//   dump.stdout.pipe(output);
//   dump.stderr.on("data", (data) => {
//     console.error("Error en mysqldump:", data.toString());
//   });

//   dump.on("close", (code) => {
//     if (code === 0) {
//       return res.json({
//         success: true,
//         message: "Respaldo generado exitosamente",
//         path: backupPath,
//       });
//     } else {
//       return res.status(500).json({
//         success: false,
//         message: "Error al generar respaldo",
//       });
//     }
//   });
// });

/**********************Inicia preparación para restaurar el backup*****************************/

// Guardar el archivo en /backups
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../backups"));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // O generar un nombre único
  },
});

const upload = multer({
  dest: path.join(__dirname, "../backups"),
  limits: { fileSize: 200 * 1024 * 1024 }, // 200MB
});

/********************************* Ruta para restaurar backup ************************************/
router.post("/restore", auth, upload.single("file"), (req, res) => {
  console.log("✅ Nombre:", req.file?.originalname);
  console.log("📦 Tamaño:", req.file?.size);
  console.log("🗂️ Path:", req.file?.path);

  if (!req.file) {
    console.log("⚠️ No se recibió archivo");
    return res
      .status(400)
      .json({ success: false, message: "No se recibió ningún archivo." });
  }

  console.log("📄 Archivo recibido:", req.file);

  const filePath = path.join(__dirname, "../backups", req.file?.filename);

  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "No se recibió el archivo" });
  }

  const { exec } = require("child_process");

  const user = process.env.MYSQLUSER;
  const password = process.env.MYSQL_ROOT_PASSWORD;
  const database = process.env.MYSQL_DATABASE;
  const dumpFile = req.file.path.replace(/\\/g, "/");

  // const cmd = `mysql -u ${user} -p${password} ${database} < "${filePath}"`;
  const cmd = `mysql -u ${user} -p${password} ${database} --verbose < "${filePath}"`;

  console.log("🔁 Restaurando desde:", dumpFile);

  exec(cmd, { maxBuffer: 1024 * 1024 * 1024 }, (err, stdout, stderr) => {
    if (err) {
      console.error("Error al restaurar:", err);
      return res.status(500).json({
        success: false,
        message: "Error al restaurar la base de datos",
      });
    }
    // ✅ Eliminar archivo temporal
    fs.unlinkSync(req.file.path);
    console.log("🧹 Archivo temporal eliminado:", req.file.path);
    return res.json({ success: true, message: "Restauración completada" });
  });
});

/********************************** Ruta para descargar backups ************************************/
router.get("/download/:fileName", (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(__dirname, "../backups", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, message: "Archivo no encontrado" });
  }

  res.download(filePath);
});

module.exports = router;
