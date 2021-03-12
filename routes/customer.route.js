module.exports = app => {
    const customer = require("../controllers/customer.controller.js");    

    // Create a new customer
    app.post("/customer/:articleId", customer.buy);
  
     //Find all customers
    app.get("/customers", customer.findAll);
  
  };
