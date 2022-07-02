const express = require('express');
const { computeC } = require("../controller/computeC")
const { computeCpp17 } = require("../controller/computeCpp17.js");
const { computeCpp14 } = require("../controller/computeCpp14.js");
const { computePython3 } = require("../controller/computePython3.js")
const { computePython2 } = require("../controller/computePython2.js")
const { computeJavascript } = require("../controller/computeJavascript.js")
const upload = require("../utils/upload.js");
const Router = express.Router()
Router.post('/computec', upload, computeC)
Router.post('/computecpp17', upload, computeCpp17);
Router.post('/computecpp14', upload, computeCpp14);
Router.post('/computepython3', upload, computePython3)
Router.post('/computepython2', upload, computePython2)
Router.post('/computejavascript', upload, computeJavascript)
module.exports = Router