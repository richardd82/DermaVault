const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth'); // Middleware para validar JWT


const createFullHistory = require("../controllers/createFullHistory");
const updateFullHistory = require("../controllers/updateFullHistory");
const deleteHistory = require("../controllers/deleteHistory");
const getByCedula = require("../controllers/getByCedula");
const searchHistories = require("../controllers/searchHistories");
const historiesArray = require("../controllers/createArrayHistories");
const getAllHistories = require("../controllers/getAllHistories");
const uploadMedHistoriesArrayChunk = require("../controllers/uploadMedHistoriesArrayChunk");

router.get("/", auth, getAllHistories);
router.post("/create", auth, createFullHistory);
router.get("/cedula/:cedula", auth, getByCedula);
router.put("/:id", auth, updateFullHistory);
router.delete("/:id", auth, deleteHistory);
router.get("/search", auth, searchHistories);
router.post("/array", historiesArray);
router.post("/uploadArray", uploadMedHistoriesArrayChunk);



module.exports = router;
