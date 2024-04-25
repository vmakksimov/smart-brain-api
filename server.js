const express = require('express');
const bodyParser = require('body-parser'); // latest version of exressJS now comes with Body-Parser!
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const morgan = require('morgan');


const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
console.log(process.env.POSTGRES_URI)
const db = knex({
  // connect to your own database here:
  client: 'pg',
  connection: {
    host : process.env.POSTGRES_HOST,
    user : process.env.POSTGRES_USER,
    password : process.env.POSTGRES_PASSWORD,
    database : 'smart-brain'
  }
  // connection: process.env.POSTGRES_URI
});
console.log('hahahha')
const app = express();
app.use(cors())
app.use(bodyParser.json());
app.use(morgan('combined')) // latest version of exressJS now comes with Body-Parser!

app.get('/', (req, res)=> { res.send(db.users) })
app.post('/signin', signin.signinAuthentication(db, bcrypt))
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db)})
app.post('/profile/:id', (req, res) => { profile.handleProfileUpdate(req, res, db)})
app.put('/image', (req, res) => { image.handleImage(req, res, db)})
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)})

app.listen(3000, ()=> {
  console.log('app is running on port 3000');
})