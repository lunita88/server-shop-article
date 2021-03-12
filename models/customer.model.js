const sql = require("./database.js");

// constructor
const Customer = function(customer) {
    this.email = customer.email;
    this.name = customer.name;
    this.address = customer.address;
    this.article_id = customer.article_id;
  };
//definisana buy funkcija radi insert 
Customer.buy = (newCustomer, result) => {
  sql.query("INSERT INTO customers SET ?", newCustomer, (err, res) => {
    if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
    console.log("created Customer: ", { id: res.insertId, ...newCustomer });
    result(null, { id: res.insertId, ...newCustomer });
  });
};

module.exports = Customer;
