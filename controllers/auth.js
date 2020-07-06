const User = require('../models/user')
const { validationResult } = require('express-validator');
const {errorHandler} = require('../helpers/dbErrorHandler')
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')

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
      user.salt = undefined
      user.hashed_password = undefined
      res.send(user)
    })  
  }
} 

exports.signin = (req, res) => {
  const {email, password} = req.body
  User.findOne({email}, (err, user) => {
    if(err || !user) {
      return res.status(400).send({'Error': 'User does not exists. Please Signup!'})
    }
    // if user's email and password matches and are correct
    if(!user.authenticate(password)){
      return res.status(401).send({Error: 'Email or Password do not match!'})
    }

    // generate a token with user secret
    const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET)
    // persist the token in cookies with expiry time
    res.cookie('t', token, {expire: new Date() + 9999})
    // return response to 
    const {_id, name, email, role} = user
    return res.send({token, user: {_id, email, name, role}})
  })
}

exports.signout = (req, res) => {
  res.clearCookie('t')
  res.send({message: ' Signed out Successfully!'})
}

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  userProperty: 'auth',
  algorithms: ['HS256']
})

exports.isAuth = (req, res, next) => {
  let user = req.profile && req.auth && req.profile._id == req.auth._id
  if(!user){
    return res.status(403).send({'Error': 'Access denied to other Users!'})
  }
  next()
}

exports.isAdmin = (req, res, next) => {
  if(req.profile.role === 0){
    return res.status(403).send({'Error': 'Admin Section. Access Denied!'})
  }
  next()
}