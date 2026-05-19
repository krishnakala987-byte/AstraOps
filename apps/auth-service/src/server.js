const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(express.json());

const userRoutes = require("../routes/userRoutes");

app.use("/", userRoutes);

app.get("/", (req, res) => {
  res.send("auth-service running");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`auth-service running on port ${PORT}`);
});