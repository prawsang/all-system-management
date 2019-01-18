const express = require("express");
const router = express.Router();

router.get('/', (req, res) => res.sendStatus(200));
router.use("/model", require('./model'));
router.use("/user", require("./user"));
router.use("/branch", require("./branch"));
router.use("/job", require("./job"));
router.use("/customer", require("./customer"));


module.exports = router;
