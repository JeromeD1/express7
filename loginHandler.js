const database = require("./database");


const postLogin = (req, res) => {
    if(req.body.email === "dwight@theoffice.com" && req.body.password === "123456") {
        res.send("Credentials are valid")
    } else {
        res.sendStatus(401)
    }

}

const getUserByEmailWithPasswordAndPassToNext =(req, res, next) => {
    const {email} = req.body

    database
    .query("select * from users where email = ?", [email])
    .then(([users]) => {
      if (users[0] != null) {
        req.user =users[0];
        next();
      } else {
        res.sendStatus(401);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });

}


module.exports = {
    postLogin,
    getUserByEmailWithPasswordAndPassToNext
  };