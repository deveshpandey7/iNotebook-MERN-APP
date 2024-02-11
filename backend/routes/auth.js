const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = 'Devesh ka first jwt token';

// ROUTE 1: Create a User using POST "/api/auth/createuser". No Login required
router.post('/createuser', [
    body('name').isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters')
], async (req, res) => {
    try {
        // If there are errors, return bad request and errors
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        // Check whether the user with the same email exists already
        const existingUser = await User.findOne({ email: req.body.email });

        if (existingUser) {
            return res.status(400).json({ errors: "A user with this email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);
        // Create a new user
        const newUser = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email,
        });

        const data = {
            user:{
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);

        return res.status(201).json({ message: 'User created successfully', authtoken });
        // return res.status(201).json({ message: 'User created successfully', user: newUser });

    } catch (error) {
        console.error('Error creating user:', error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});


// ROUTE 2: Authenticate a User using POST "/api/auth/login". No Login required
router.post('/login', [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').exists().withMessage('Password can not be blank'),
], async (req, res) => {
    try {
         // If there are errors, return bad request and errors
         const result = validationResult(req);
         if (!result.isEmpty()) {
             return res.status(400).json({ errors: result.array() });
         }

         // trying to authenticate user from database
         // deconstructing values from request body for matching
         const {email, password} = req.body;

         // find if user with email exists or not
         let user = await User.findOne({email});
         if(!user){
            return res.status(400).json({error: "Please try to login with correct credentials"});
         }

         const passwordCompare = await bcrypt.compare(password, user.password);
         if(!passwordCompare){
            return res.status(400).json({error: "Please try to login with correct credentials"});
         }

         const data = {
            user:{
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        return res.status(201).json({ message: 'User login successfull', authtoken });


    } catch (error) {
         console.error('Error creating user:', error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }

});

// ROUTE 3: Get loggedin User Details using POST "/api/auth/getuser". Login required
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        return res.status(200).json({ message: 'User data fetched', user });

    } catch (error) {
        console.error('Error creating user:', error.message);
       return res.status(500).json({ error: 'Internal Server Error' });
   }
});


module.exports = router;
