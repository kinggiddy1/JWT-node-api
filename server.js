const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'This API is working smoothly' });
});

// Import user routes
const usersRoutes = require('./routes/users');

// Use the users routes
app.use('/api/auth', usersRoutes);
//app.use('/api/', usersRoutes);
  

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
