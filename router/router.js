const express = require('express');
const {computeFile,sendHello } =require( "../controller/compute.js");
const  upload =require("../utils/upload.js");
const Router = express.Router()
Router.post('/compute', upload, computeFile);
module.exports = Router