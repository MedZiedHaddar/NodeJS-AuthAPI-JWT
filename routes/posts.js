const router = require('express').Router();
const verify = require('./verifyToken');


router.get('/',verify,(req,res) => {
    
    res.send(req.user); // req.user is from verify
    
    // User.findbyOne({_id:req.user._id});
    /*res.json({

        posts: {
            title:'My first post',
            description:'Data u shouldnt access without token'
        }
    });*/

    
});

module.exports = router;