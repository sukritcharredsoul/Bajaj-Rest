// src/app.js
const express = require("express");
const cors = require("cors");

const bfhlRoutes = require("./routes/bfhlRoutes");
const healthRoutes = require("./routes/healthRoutes")

const app = express();

app.use(cors()); 
app.use(express.json());

app.use('/api',healthRoutes)
app.use("/", bfhlRoutes);

module.exports = app;