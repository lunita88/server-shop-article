const sql = require("./database.js");

// constructor
const Article = function(article) {
    this.id = article.id;
    this.title = article.title;
    this.summary = article.summary;
    this.price = article.price;
    this.photo = article.photo;
  };

  Article.create = (newArticle, result) => {
    sql.query("INSERT INTO Articles SET ?", newArticle, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      console.log("created Article: ", { id: res.insertId, ...newArticle });
      result(null, { id: res.insertId, ...newArticle });
    });
  };



  Article.getAll = result => {
    sql.query("SELECT * FROM Articles", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log("articles: ", res);
      result(null, res);
    });
  };



Article.photoFind = (articleId, result) => {
    var photoReq =`SELECT photo FROM Articles WHERE id = ${articleId}`;
      sql.query(photoReq, articleId, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
      
      console.log(res);
      result(null, res[0].photo);
  });
  };



  Article.findById = (articleId, result) => {
    sql.query(`SELECT * FROM Articles WHERE id = ${articleId}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("found article: ", res[0]);
        result(null, res[0]);
        return;
      }
      // not found Article with the id
      result({ kind: "not_found" }, null);
    });
  };


  Article.remove = (id, result) => {
    sql.query("DELETE FROM Articles WHERE id = ?", id, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      if (res.affectedRows == 0) {
        // not found Article with the id
        result({ kind: "not_found" }, null);
        return;
      }
  
      console.log("deleted article with id: ", id);
      result(null, res);
    });
  };

  Article.updateById = (id, article, result) => {
    sql.query(
      "UPDATE Articles SET id = ?, title = ?, summary = ?, price = ?, photo = ? WHERE id = ?",
      [article.id, article.title, article.summary, article.price, article.photo, id],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
  
        if (res.affectedRows == 0) {
          // not found Article with the id
          result({ kind: "not_found" }, null);
          return;
        }
  
        console.log("updated article: ", { id: id, ...article });
        result(null, { id: id, ...article });
      }
    );
  };

module.exports = Article;
