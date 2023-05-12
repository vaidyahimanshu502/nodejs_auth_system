const mongoose = require('mongoose');
const bcryptForNode = require('bcrypt-nodejs')

//creating schema for database in which [name, emails, password will required]
let UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: { 
        type: String,
        required: true
    },
    accessToken:
    {
        type: String,
        default: 'abc'
    },
    isTokenValid:
    {
        type: Boolean,
        default: false
    },
 },
    {
        timestamps: true
    }
)

// hash the password
UserSchema.methods.generateHash = function(password) {
    try {
        return bcryptForNode.hashSync(password, bcryptForNode.genSaltSync(8), null);
    } catch (error) {
        console.log('Error***', error)
    }
  };
  
// checking if password is valid
UserSchema.methods.validPassword = function(password) {  
    return bcryptForNode.compareSync(password, this.password);
  };

let User = mongoose.model('user', UserSchema);
module.exports = User;
