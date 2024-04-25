let jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const handleSignin = (db, bcrypt, req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return Promise.reject('incorrect form submission');
  }
  return db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {

      console.log("data in handleSign in", data)
      const isValid = bcrypt.compareSync(password, data[0].hash);
      console.log(isValid)
      if (isValid) {
        return db.select('*').from('users')
          .where('email', '=', email)
          .then(user => user[0])
          .catch(err => Promise.reject('unable to get user'))
      } else {
        console.log("wrong credentials")
        Promise.reject('wrong credentials')
      }
    })
    .catch(err => Promise.reject('wrong credentials1'))
}

const getAuthTokenId = () => {
  console.log('auth ok');
}

const signToken = (email) => {
  const jwtPayload = { email };
  console.log("jwt", jwt)
  let jwtSecretKey = process.env.JWT_SECRET_KEY;
  console.log("secret key", jwtSecretKey)
  const token = jwt.sign(jwtPayload, jwtSecretKey);
  console.log("jwt token:", token)
  return token

}

const createSessions = (user) => {
  const { email, id } = user;
  const token = signToken(email);
  console.log("CreateSession token", token)
  return { success: 'true', userId: id, token }
}

const signinAuthentication = (db, bcrypt) => (req, res) => {
  const { authorization } = req.headers;
  return authorization ? getAuthTokenId() :
    handleSignin(db, bcrypt, req, res)
      .then(data => {
        return data.id && data.email ? createSessions(data) : Promise.reject(data)
      })
      .then(session => res.json(session))
      .catch(err => res.status(400).json('here is the wrong code'))
}


module.exports = {
  signinAuthentication: signinAuthentication
}
