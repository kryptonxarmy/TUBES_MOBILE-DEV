const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const productsRoutes = require("./src/routes/products");
const salesRoutes = require("./src/routes/sales");
const financialRecordsRoutes = require("./src/routes/financialRecords");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/products", productsRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/financial-records", financialRecordsRoutes);

app.get("/", (req, res) => {
  res.send("NYAWNYAWWW !");
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
