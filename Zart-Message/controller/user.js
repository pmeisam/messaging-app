const User = require('../models/user');
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;

module.exports = {
    signup,
    login,
    editUser,
    getUser,
    searchUser,
    findUser
  };

  async function findUser(req, res) {
    const user = await User.findOne({phone: req.params.user});
    res.json(user);
  }

  async function getUser(req, res) {
    const user = {
      name: "Meisam",
      password: "abc123"
    }
    return res.json(user)
  }

  async function searchUser(req , res){
    const user = await User.findOne({phone : req.body.search})
    // console.log('search user : ' , user)
    if(user) return res.json(user)
  }

  function editUser (req, res) {
    // console.log("Ctrl: ",req.body)
    
  }


  
  async function login(req, res) {
    try {
      const user = await User.findOne({email: req.body.email});
      if (!user) return res.status(401).json({err: 'bad credentials'});
      user.comparePassword(req.body.pw, (err, isMatch) => {
        if (isMatch) {
          const token = createJWT(user);
          res.json({token});
        } else {
          return res.status(401).json({err: 'bad credentials'});
        }
      });
    } catch (err) {
      return res.status(401).json(err);
    }
  }
  
  async function signup(req, res) {
    const user = new User(req.body);
    try {
      await user.save();
      const token = createJWT(user);
      res.json({token});
    } catch (err) {
      // Probably a duplicate email
      res.status(400).json(err);
    }
  }
  
  
  /*--- helper functions ---*/
  
  function createJWT(user) {
    return jwt.sign(
      {user},
      SECRET,
      {expiresIn: '24h'}
    );
  }