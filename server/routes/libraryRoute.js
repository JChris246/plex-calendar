const express = require("express");
const router = express.Router();
const controller = require("../controllers/LibraryController");

router
    .get("/", controller.getLibraries)
    .get("/:library/:date_stamp", controller.getMediaOnDate)
    .get("/details/:library/:id", controller.getMediaDetails);

module.exports = router;