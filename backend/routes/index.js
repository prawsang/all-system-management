const express = require("express");
const router = express.Router();

router.get('/', (req, res) => res.sendStatus(200));
router.use("/model", require('./model'));
router.use("/service_report", require("./service_report"));
router.use("/acc", require("./accessory"));


module.exports = router;
