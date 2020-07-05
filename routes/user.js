// For providing Routing to App
const express = require('express')
const router = express.Router()
const { signup } = require('../controllers/user')
const { body } = require('express-validator');

router.post('/signup', [
    body("name", "Name is required!").notEmpty(),
    body("email", "Email is required!").notEmpty()
        .matches(/.+\@.+\..+/)
        .withMessage("Email must contain @ character!")
        .isLength({
            min: 4,
            max: 32
        }),
    body("password", "Password is required!").notEmpty(),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must contain at least 6 characters long!")
        .matches(/\d/)
        .withMessage("Password must also contain a number!")
], signup)

module.exports = router