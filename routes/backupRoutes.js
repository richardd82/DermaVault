const express = require("express");
const { exec } = require("child_process");
const auth = require("../middleware/auth");
const path = require("path");
const router = express.Router();
const multer = require("multer");
const { spawn } = require("child_process");
const fs = require("fs");
const { sequelize } = require("../models");


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
      // console.log("✅ Backup generado:", fileName);
  
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
router.post("/restore", auth, upload.single("file"), async (req, res) => {
  // console.log("✅ Nombre:", req.file?.originalname);
  // console.log("📦 Tamaño:", req.file?.size);
  // console.log("🗂️ Path:", req.file?.path);

  // if (process.env.NODE_ENV === "production") {
    try {
      const sql = fs.readFileSync(req.file.path, "utf8");
      await sequelize.query(sql, { raw: true, multipleStatements: true });
  
      fs.unlinkSync(req.file.path);
      return res.json({ success: true, message: "Respaldo restaurado con éxito" });
    } catch (err) {
      console.error("❌ Error al restaurar:", err);
      return res.status(500).json({ success: false, message: "Error al restaurar respaldo" });
    }  
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
