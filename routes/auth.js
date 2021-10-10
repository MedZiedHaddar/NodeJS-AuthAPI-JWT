const router = require('express').Router();
const User = require('../model/User');
const {registerValidation,loginValidation} = require('../validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


//For Validation
const Joi = require('@hapi/joi');

const schema = {
    name: Joi.string().min(6).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required()
}


//Register

router.post('/register',async(req,res) => {

    // Validation before creating a user
    const {error} = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //checking if user exists in DB
    const emailExist = await User.findOne({email:req.body.email});
    if (emailExist) return res.status(400).send('Email already exists');

    //Hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password,salt);
    

    //Create a user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    try{
        const savedUser = await user.save();
        res.send({user:user._id});
    }catch(err){
        res.status(400).send(err);
    }

});


//Login
router.post('/login', async (req,res) =>{

    // Validation before checking a user
    const {error} = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //checking if Email/user exists in DB so we can give him acess
    const user = await User.findOne({email:req.body.email});
    if (!user) return res.status(400).send('Email doesnt exist');
    
    //Checking if password is correct
    const validPass = await bcrypt.compare(req.body.password,user.password);
    if (!validPass) return res.status(400).send('Invalid Password');

    //Create and assign a token
    const token = jwt.sign({_id:user._id},process.env.TOKEN_SECRET);
    res.header('auth_token',token).send(token);



    res.send('Logged In');

});




module.exports = router;