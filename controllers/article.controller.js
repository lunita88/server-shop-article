const Article = require("../models/article.model.js"),
      fs = require('fs');

// Create and Save a new Article
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: "Title can not be empty!"
    });
    return;
  }
  if (!req.body.summary) {
    res.status(400).send({
      message: "Summary can not be empty!"
    });
    return;
  }
  if (!req.body.price) {
    res.status(400).send({
      message: "Price can not be zero or negative!"
    });
    return;
  }
  if (!req.file) {
    res.status(400).send({
      message: "Please upload an image!"
    });
    return;
  }

  // Create a Article
  const article = new Article({
    //id: req.body.id,
    title: req.body.title,
    summary: req.body.summary,
    price: req.body.price,
    photo: req.file.filename
  });

  // Save Article in the database
  Article.create(article, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Article."
      });
    else res.send(data);
  });
};

// Retrieve all Article from the database.
exports.findAll = (req, res) => {
  Article.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving articles."
      });
    else res.send(data);
  });
};

  // Find a single article with a articleId
exports.findOne = (req, res) => {
    Article.findById(req.params.articleId, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Article with id ${req.params.articleId}.`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving Article with id " + req.params.articleId
          });
        }
      } else res.send(data);
    });
  };
  
  // Delete a Article with the specified customerId in the request
exports.delete = (req, res) => {
    //remove file(img) from folder-'uploads'
    Article.photoFind(req.params.articleId, (err, data) => {
      var photoPath = process.env.PWD + '/uploads/' + data;
      if (err) {
         console.log("error: ", err);
      }else {
        fs.unlink(photoPath, (err) => {
          if (err) {
             console.error(err)
             return
          }
          //file removed
        })
        console.log(data + " photo removed");
      }
    });
    
    Article.remove(req.params.articleId, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Article with id ${req.params.articlekId}.`
          });
        } else {
          res.status(500).send({
            message: "Could not delete Article with id " + req.params.articleId
          });
        }
      } else res.send({ message: `Article was deleted successfully!` });
    });
  };

  // Update a article identified by the articleId in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body.title) {
      res.status(400).send({
        message: "Title can not be empty!"
      });
      return;
    }
    if (!req.body.summary) {
      res.status(400).send({
        message: "Summary can not be empty!"
      });
      return;
    }
    if (!req.body.price) {
      res.status(400).send({
        message: "Price can not be zero or negative!"
      });
      return;
    }
    if (!req.file) {
      res.status(400).send({
        message: "Please upload an image!"
      });
      return;
    }

    const article = new Article({
      title: req.body.title,
      summary: req.body.summary,
      price: req.body.price,
      photo: req.file.filename
    }); 
    Article.photoFind(req.params.articleId, (err, photoName) => {
      const photoPath = process.env.PWD + '/uploads/' + photoName;
        if (err) {
           console.log("error: ", err);
        }else {
          fs.unlink(photoPath,(err) => {
            if (err) {
              console.error(err)
              return
           }
          //file removed
        })
        console.log(photoName);
      }
    }); 
  

  Article.updateById(
    req.params.articleId,
    article,
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Article with id ${req.params.articleId}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Article with id " + req.params.articleId
          });
        }
      } else res.send(data);
    }
  );
};