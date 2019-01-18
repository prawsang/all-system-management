const express = require("express");
const router = express.Router();
const StoreType = require("../models/StoreType");

router.route("/get-all").get((req, res) =>
    StoreType.findAll()
		.then(types => {
			res.send(types);
		})
		.catch(err => console.log(err))
);

module.exports = router;