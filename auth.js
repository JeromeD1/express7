const argon2 = require("argon2");
const jwt = require('jsonwebtoken');

const hashPassword = async (req, res, next) => {
  // hash the password using argon2 then call next()
  const hashingOptions = {
    type: argon2.argon2id,
    memoryCost: 2 ** 14,
    timeCost: 2,
    parallelism: 1,
}

const hashedPassword = await argon2.hash(req.body.password, hashingOptions);
console.log(hashedPassword);

req.body = {...req.body, hashedPassword: hashedPassword}
delete req.body.password
next()

};

const verifyPassword =  async (req, res) => {
    const password=req.body.password

    console.log("mdpas",req.user.hashedPassword);
    try {
        if(await argon2.verify(req.user.hashedPassword, password) === true) {
            
            const payload = {sub: req.user.id};
            const token = jwt.sign(payload, process.env.JWT_SECRET,{
                expiresIn: "1h",
            });


            // res.status(200).send("Credentials are valid")
            res.send({token, user:req.user});
        } else {

            // const hashingOptions = {
            //     type: argon2.argon2id,
            //     memoryCost: 2 ** 14,
            //     timeCost: 2,
            //     parallelism: 1,
            // }
            
            // const hashedPassword = await argon2.hash(password, hashingOptions);
            // console.log("verif",hashedPassword);
            res.sendStatus(401)
        }
    } catch (err) {
        res.sendStatus(500)
    }
    
    
  }


  const verifyToken = (req, res, next) => {
    try {
      const authorizationHeader = req.get("Authorization");
  
      if (authorizationHeader == null) {
        throw new Error("Authorization header is missing");
      }
  
      const [type, token] = authorizationHeader.split(" ");
  
      if (type !== "Bearer") {
        throw new Error("Authorization header has not the 'Bearer' type");
      }
  
      req.payload = jwt.verify(token, process.env.JWT_SECRET);
  
      next();
    } catch (err) {
      console.error(err);
      res.sendStatus(401);
    }
  };



module.exports = {
  hashPassword,
  verifyPassword,
  verifyToken
};