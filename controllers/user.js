const User = require('../models/user')
const { validationResult } = require('express-validator');
const {errorHandler} = require('../helpers/dbErrorHandler')

exports.signup = (req, res) => {
  const errors = validationResult(req);
  const err = errors.array()
  if(err.length > 0) {  
    const firstError = err.map(err => err.msg)[0];
    return res.status(400).send({ error: firstError });
  }
  else {
    const user = new User(req.body)
    user.save((err, user) => {
      if(err){
        return res.status(400).send({'Error': errorHandler(err)})
      }
      res.send(user)
    })  
  }
} 