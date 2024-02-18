// Import required modules
const express = require('express');
const cors = require('cors');
const connectToMongo = require('./db');
const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');

// Create Express app
const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
connectToMongo();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start the server
app.listen(port, () => {
    console.log(`iNotebook backend is running on port ${port}`);
});
