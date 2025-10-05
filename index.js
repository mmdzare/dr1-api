const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const verifyDoctor = require("./api/verify-doctor");

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("API is running");
});

app.get("/api/verify-doctor", verifyDoctor);

app.use((req, res) => {
  res.status(404).json({ error: "مسیر یافت نشد" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ dr1-api is running on port ${PORT}`);
});
