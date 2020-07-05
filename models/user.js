const mongoose = require('mongoose')
const crypto = require('crypto')
const { uuid } = require('uuidv4');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    maxlength: 32
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    required: true,
    maxlength: 32
  },
  hashed_password: {
    type: String,
    required: true
  },
  about: {
    type: String,
    trim: true,
    maxlength: 150
  },
  salt: String,
  role: {
    type: Number,
    default: 0
  },
  history:{
    type: Array,
    default: []
  }
}, {timestamps: true})


//virtual fields for password hashing (i.e saving data as per our rules)
userSchema.virtual('password')
  .set(function(password){
    this._password = password,
    this.salt = uuid(),
    this.hashed_password = this.encryptPassword(password)
  })
  .get(function(){
    return this._password
  })


// how encryptPassword() creates passwords
userSchema.methods = {
  authenticate: function(plaintext){
    return this.encryptPassword(plaintext) === this.hashed_password
  },

  encryptPassword: function(password){
    if(!password){
      return ''
    }
    try{
      return crypto.createHmac('sha1', this.salt)
        .update(password)
        .digest('hex')
    }
    catch(e) {
      return e
    }
  }
}


module.exports = mongoose.model('User', userSchema)