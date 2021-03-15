const sql = require("./database.js"),
      bcrypt = require('bcrypt');

// constructor
const User = function(user) {
  this.email = user.email;
  this.password = bcrypt.hashSync(user.password, 10);
};

User.login = (user, result) => {
   sql.query(`SELECT * FROM users WHERE email = '${user.email}'`, (err, res) => {
      if (err) {
         console.log("error: ", err);
         result(err, null);
         return;
      }
      if (res.length) {
        //console.log("found user: ", res[0]);
        if (bcrypt.compareSync(user.password, res[0].password)) { 
         
          //console.log("password match!");
          result(null, { email: res[0].email });
          return;
        } else {
          result({ msg: "Authentication failed. Invalid email or password." }, null);
        }
      }
      // not found User with the id
      result({ msg: "Authentication failed. User not found." }, null);
   });
}

User.signup = (newUser, result) => {
  sql.query(`INSERT INTO users SET ?`, newUser, (err, res) => {
    if (err) {
      console.log("error: ", err);
      // if sql return ER_DUP_ENTRY we consider this duplicate email entry
      // since email field is PRIMARY KEY so we return message
      if (err.code == 'ER_DUP_ENTRY') {
        result({ msg: "This email is already registered." }, null);
        return;
      }
      result(err, null);
      return;
    }
    console.log("created user: ", { ...newUser });
    result(null, { ...newUser });
  });
}

module.exports = User;
