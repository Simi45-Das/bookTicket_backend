const { getSeatsController, bookSeatsController, cancelSeatsController, resetSeatsController, getSeatCounts } = require("../controller/seat");
const authenticate = require("../middleware/authenticate");

const express = require('express');
const router = express.Router();

router.get("/seats", authenticate, getSeatsController);
router.post("/book", authenticate, bookSeatsController);
router.post("/cancel", authenticate, cancelSeatsController);
router.post("/reset", resetSeatsController);
router.get("/seat-counts", authenticate, getSeatCounts); 

module.exports = router;
