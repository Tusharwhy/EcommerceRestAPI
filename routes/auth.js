const router = require("express").Router();
const User = require("../models/User") //to create user. need to import mu user from model
const CryptoJS = require("crypto-js")

/*
  we gonna add JWT(json web token). To verify users and provide them a jsonwebtoken 
  after login process so whenever they try to make any request for updating,deleting user,
  product or cart. we gonna verify if the user, cart or order belongs to client
*/
const jwt = require("jsonwebtoken");

//REGISTER
router.post("/register",async (req, res) => {

    const newUser = new User({
        username: req.body.username,   //we are using body to take username from user
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, 
            process.env.PASS_SEC)
            .toString(), //password can be leaked so we can encrypt it using hashing.yarn add cryptojs  
          
    });
    /*
    we can save user but as it returns the promise, we don't know actual time required
    totally depends on mongoDB servers,user internet meanwhile JS will start executing
    next line of code. Below lines won't work because first it'll start the process and 
    after that instantly it'll try to log saved user but uptill that time we dont have 
    any saved user as it takes couple of seconds.To prevent this we use Async functions
    */

    try{//And if theres a problem we can catch the problem in try & catch.
        const savedUser = await newUser.save();// we wait untill this process
        res.status(201).json(savedUser);
    } catch(err){
        res.status(500).json(err)
        
    }
});

//LOGIN
router.post("/login", async(req,res)=> {
    
    try{
    const user = await User.findOne({username: req.body.username}); //finds the user in DB by using findone method from 'User model' as there's only one username.
    if(!user){

        res.status(401).json("credentials incorrect!")//if there's no user.
        return
    }

    const hashedPassword = CryptoJS.AES.decrypt(
        user.password,
        process.env.PASS_SEC);//our hashed password

    const Originalpassword = hashedPassword.toString(CryptoJS.enc.Utf8);//turning it into string
    
    if(Originalpassword !== req.body.password){
        
        res.status(401).json("credentials incorrect!");
        return
    }

     const accessToken = jwt.sign(
        {//we are going to pass property and keep our id and isAdmin property inside our token.
        id:user._id,
        isAdmin: user.isAdmin,
        },
     
     process.env.JWT_SEC,
     {expiresIn:"3d"});
     
     const {password, ...others} = user._doc; // this ensures our password is not visible. mongodb stores our documents here "_doc"
     res.status(200).json({...others,accessToken})//if it matches then its successful

    }catch(err){
        res.status(500).json(err)
    }
})

module.exports = router;