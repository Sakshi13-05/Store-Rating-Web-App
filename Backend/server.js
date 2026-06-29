require("dotenv").config();
const express = require("express")
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

require("./config/db");

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

const storeRoutes = require("./routes/storeRoutes");
app.use("/api/stores", storeRoutes);

const ownerRoutes = require("./routes/ownerRoutes");
app.use("/api/owner", ownerRoutes);

const userRoutes = require("./routes/userRoutes");
app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
    res.send("Bkend running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`server running on ${PORT}`)
})