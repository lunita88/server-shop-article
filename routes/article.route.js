module.exports = app => {
    const article = require("../controllers/article.controller.js");
    const user = require("../controllers/user.controller.js"); 
    const multer  = require('multer');
    const path = require('path');
    
    var storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, 'uploads/')
      },
        
     filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
      }
    })
    const upload = multer({ storage:storage});

    // Create a new article
    app.post("/article", [user.authenticateToken, upload.single("article_photo")], article.create);
  
     //Retrieve all articles
    app.get("/articles", article.findAll);

    //Delete a article with articleId
    app.delete("/article/:articleId", user.authenticateToken, article.delete);
  
     //Retrieve a single article with articleId
    app.get("/article/:articleId", article.findOne);
  
     //Update a article with articleId
    app.put("/article/:articleId", [user.authenticateToken, upload.single("article_photo")], article.update);
  
  };
