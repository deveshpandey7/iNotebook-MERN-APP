const express = require('express');
const cors = require('cors')
const connectToMongo = require('./db');
const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');

const app = express();
const port = 5000;


// Connect to MongoDB
connectToMongo();

// Middleware
app.use(express.json());
app.use(cors())

// Routes
app.use('/api/auth', authRoutes); // Use authRoutes directly as a route
app.use('/api/notes', notesRoutes); // Use notesRoutes directly as a route

// Start the server
app.listen(port, () => {
  console.log(`iNotebook backend is running on port ${port}`);
});
