const express = require("express");
const router = express.Router();
const StoreType = require("../models/StoreType");

router.route("/get-all").get((req, res) =>
	StoreType.findAll()
		.then(types => {
			res.send(types);
		})
		.catch(err => res.status(500).send(err))
);

module.exports = router;
