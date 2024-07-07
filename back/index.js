const express = require("express");
require("dotenv").config();
const { connectDatabase } = require("./utils/database");
const authRoutes = require("./routes/authRoutes");
const cron = require("node-cron");

connectDatabase();

const app = express();

app.use(express.json());

app.use("/", authRoutes);

port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`server started on port ${port}`);
});

// Ping the server every 5 minutes to prevent it from sleeping
cron.schedule("*/5 * * * *", async () => {
  try {
    await axios.get(`https://hng-backstage-2.onrender.com/`);
    console.log("Server pinged successfully");
  } catch (error) {
    console.error("Error pinging server:", error);
  }
});

module.exports = app;
