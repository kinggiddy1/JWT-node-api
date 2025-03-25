const express = require('express');
require('dotenv').config();
const cors = require('cors');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// CORS
app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true
  }));
  




// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'This API is working smoothly' });
});

// Import user routes
const usersRoutes = require('./routes/users');
const uploadRoutes = require('./routes/uploadRoute');

// USE THE ROUTES

//app.use('/api/auth', usersRoutes);
app.use('/api/', usersRoutes);
app.use('/api/', uploadRoutes);
  

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
