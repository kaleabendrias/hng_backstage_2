const express = require("express");
require("dotenv").config();
const { connectDatabase } = require("./utils/database");
const authRoutes = require("./routes/authRoutes");

connectDatabase();

const app = express();

app.use(express.json());

app.use("/", authRoutes);

port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`server started on port ${port}`);
});

module.exports = app;
