const Customer = require("../models/customer.model.js");

exports.buy = (req, res) => {
    console.log(req.body);
    // Validate Request
    if (!req.body.email || !/\S+@\S+\.\S+/.test(req.body.email)) {
        res.status(400).json({
            message: "Email required!"
        });
        return;
    }
    if (!req.body.name) {
        res.status(400).send({
        message: "Name can not be empty!"
        });
        return;
    }
    if (!req.body.address) {
        res.status(400).send({
        message: "Address can not be empty!"
        });
        return;
    }
  
    const customer = new Customer({
        email: req.body.email,
        name: req.body.name,
        address: req.body.address,
        article_id: req.params.articleId
    });
  
    Customer.buy(
        customer,
        (err, data) => {
        if (err)
            res.status(500).send({
            message:
                err.message || "Some error occurred while adding new customer."
            });
        else res.send(data);
        }
    );
};

// Retrieve all Customers from the database.
exports.findAll = (req, res) => {
    Customer.getAll((err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving customers."
        });
      else res.send(data);
    });
  };
