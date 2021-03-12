module.exports = app => {
    const user = require("../controllers/user.controller.js");
  
    // login user
    app.post("/user/login", user.login);
  
    // create a new user
    app.post("/user/signup", user.signup);
  
  };