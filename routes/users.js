const express = require('express');
const router = express.Router();
const { register, login ,getUser, getAllUsers} = require('../controllers/userController');
const auth = require('../middleware/authGuard');
const authGuard = require('../middleware/authGuard');


  //Register
  router.post('/auth/register', authGuard ,register);
    //Login
  router.post('/auth/login', login);
    //Get User by ID
  router.get('/user/:id', getUser)
      //Get User Data
  router.get('/users', getAllUsers)
    

module.exports = router;