const User = require('../models/user')

exports.signup = (req, res) => {
  console.log(req.body)
  res.send(req.body)
  // const user = new User(req.body)
  // user.save((err, user) => {
  //   if(err){
  //     return res.status(400).send(err)
  //   }
  //   res.send(user)
  // })
} 