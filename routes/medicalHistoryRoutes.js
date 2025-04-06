const express = require("express");
const router = express.Router();

const createFullHistory = require("../controllers/createFullHistory");
const updateFullHistory = require("../controllers/updateFullHistory");
const deleteHistory = require("../controllers/deleteHistory");
const getByCedula = require("../controllers/getByCedula");
const searchHistories = require("../controllers/searchHistories");
const historiesArray = require("../controllers/createArrayHistories");
const getAllHistories = require("../controllers/getAllHistories");

router.get("/", getAllHistories);
router.post("/create", createFullHistory);
router.get("/cedula/:cedula", getByCedula);
router.put("/:id", updateFullHistory);
router.delete("/:id", deleteHistory);
router.get("/search", searchHistories);
router.post("/array", historiesArray);


module.exports = router;
