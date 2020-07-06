// Routes for User Authentication
const express = require('express')
const router = express.Router()
const { userById } = require('../controllers/user')
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth')

router.get('/secret/:userId', requireSignin, isAuth, isAdmin, (req, res) => {
  res.send({
    user: req.profile
  })
})

router.param('userId', userById)


module.exports = router