const jwt = require('jsonwebtoken');
const redis = require('redis');
const dotenv = require('dotenv');
const { json } = require('body-parser');
dotenv.config();
//setup redis:
const redisClient = redis.createClient({ url: process.env.REDIS_URI })

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

const getAuthTokenId = (req, res) => {
  const { authorization } = req.headers;
  console.log("redisClient in gethAuth", redisClient)
  console.log("authorizationINGeth", authorization)
  redisClient.connect()
  redisClient.get(authorization, (err, reply) => {
    if (err || !reply) {
      return res.status(400).json('Unathorized')
    }
  })
    .then(id => {
      redisClient.quit();
      return res.json({ id: id })
    })
    .catch(error => console.log('error in gethauthcatch', error))
    
}

const signToken = (email) => {
  const jwtPayload = { email };

  try {
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    const token = jwt.sign(jwtPayload, jwtSecretKey, { expiresIn: '1h' });
    return token;
  } catch (error) {
    console.error("Error generating JWT token:", error);
    throw error; // Optionally rethrow the error for handling by the caller
  }
}


const setToken = async (token, id) => {
  try {
    await redisClient.connect()
    const result =  redisClient.set(token, id);
    await redisClient.quit();
    return result
  } catch (err) {
    console.log("error in catch block", err)
    throw err;
  }
};


const createSessions = (user) => {
  const { email, id } = user;
  const token = signToken(email);
  return setToken(token, id)
    .then((res) => {
      console.log("resss", res, "userID", id, "token:", token)
      console.log("userID:", id, "token:", token)
      return { success: 'true', userId: id, token }
    })


}

const signinAuthentication = (db, bcrypt) => (req, res) => {
  const { authorization } = req.headers;
  return authorization ? getAuthTokenId(req, res) :
    handleSignin(db, bcrypt, req, res)
      .then(data => {
        console.log("dataaaa", data);
        return data.id && data.email ? createSessions(data) : Promise.reject(data)
      })
      .then(session => res.json(session))
      .catch(err => res.status(400).json('SOMETHING WENT WRONG'));


}




module.exports = {
  signinAuthentication: signinAuthentication,
  redisClient: redisClient
}
