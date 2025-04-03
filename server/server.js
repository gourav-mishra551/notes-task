require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require('body-parser');
const authRoutes = require("./routes/authRoutes")
const noteRoutes = require('./routes/noteRoutes');
const authMiddleware = require('./middleware/authMiddleware')

const app = express()

//middleware
app.use(cors())
app.use(bodyParser.json())

// Routes
app.use('/api/notes', noteRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Notes API' });
});

app.use("/api/auth",authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});



//connect to mongoose
mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log("mongodb connected"))
.catch((err)=>console.log(err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));