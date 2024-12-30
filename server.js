const express = require("express");
const cors = require("cors");
const seatRoutes = require("./router/seat"); 
const auth=require("./router/auth");
require("dotenv").config();

const app = express();

app.use(express.json());

app.use(cors());

app.get("/health" , (req, res) => res.send("Healthy"));


app.use("/", seatRoutes);
app.use("/", auth);   


app.use((req, res) => {
  res.status(404).send("Route not found");
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
