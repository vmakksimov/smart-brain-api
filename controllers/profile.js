const { json } = require("body-parser");

const handleProfileGet = (req, res, db) => {
  const { id } = req.params;
  db.select('*').from('users').where({ id })
    .then(user => {
      if (user.length) {
        res.json(user[0])
      } else {
        res.status(400).json('Not found')
      }
    })
    .catch(err => res.status(400).json('error getting user'))
}



const handleProfileUpdate = (req, res, db) => {
  const { id } = req.params;
  console.log(req.body)
  const {name, age, pet} = req.body.formInput;
  db('users')
    .where({ id })
    .update({ name })
    .then(res => {
      console.log("res on update", res)
      if (res) {
        res.json('success')
      } else {
        res.status(400).json('not found')
      }
    })
    .catch(error => {
      res.status(400).json('error in the catch');
    })
}

module.exports = {
  handleProfileGet,
  handleProfileUpdate
}