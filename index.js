const express = require("express");
const cors = require("cors");
const verifyDoctor = require("./api/verify-doctor"); // مسیر دقیق به فایل اسکرپ

const app = express();
app.use(cors());

app.get("/api/verify-doctor", verifyDoctor);

app.listen(3000, () => {
  console.log("✅ dr1-api is running on port 3000");
});
