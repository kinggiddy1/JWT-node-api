const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/userController');
const auth = require('../middleware/authGuard');
const authGuard = require('../middleware/authGuard');


  //Register
  router.post('/register', authGuard ,register)
    //Login
  router.post('/login', login)
    

module.exports = router;