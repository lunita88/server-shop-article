const User = require("../models/user.model.js"),
      jwt = require('jsonwebtoken')


exports.authenticateToken = (req, res, next) => {
  // Gather the jwt access token from the request header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1] || null;
  if (token === null) return res.status(401).json({ message: 'Unauthorized access.' }); // if there isn't any token

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(403).json({ message: 'Verification failed.'});
    }
    req.user = user;
    next(); // pass the execution off to whatever request the client intended
  });
}

exports.login = (req, res) => {
  // Validate request
  var re = /\S+@\S+\.\S+/;
  if (!req.body.email || !re.test(req.body.email)) {
      res.status(400).json({
      message: "Email required!"
     });
     return;
   }
  if (!req.body.password) {
      res.status(400).json({
      message: "Password required!"
     });
     return;
   }
  
  let user = req.body;
  console.log(user);
      
  User.login(user, (err, data) => {
    if (err) {
      res.status(401).json({
        message:
          err.msg || "Some error occurred while logging the User."
      });
    } else {
      let payload = { email: data.email };
      //console.log(process.env.ACCESS_TOKEN_LIFE);
      let accessToken = jwt.sign(
          payload, process.env.ACCESS_TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: process.env.ACCESS_TOKEN_LIFE
      });
      console.log("token created: ", accessToken);
      res.json({ token: accessToken });
    }
  });
}


// Create a new User
exports.signup = (req, res) => {
  // Validate request
  var re = /\S+@\S+\.\S+/;
  if (!req.body.email || !re.test(req.body.email)) {
      res.status(400).send({
       message: "Email required!"
    });
    return;
  }
  if(!req.body.password) {
     res.status(400).send({
        message: "Password required!"
    });
    return;
  }

  // Create a User
  const user = new User({
    email: req.body.email,
    password : req.body.password
  });

  // Save User in the database
  User.signup(user, (err, data) => {
    if (err) {
      res.status(403).json({
        message:
          err.msg || "Some error occurred while creating the user."
      });
    }
    else {
      let payload = { email: data.email };
      
      let accessToken = jwt.sign(
        payload, process.env.ACCESS_TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: process.env.ACCESS_TOKEN_LIFE
      });
      console.log("Token created", accessToken);
      res.json({ token: accessToken  });
    }
  });
};


  
      
