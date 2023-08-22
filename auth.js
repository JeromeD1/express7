const argon2 = require("argon2");

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

module.exports = {
  hashPassword,
};