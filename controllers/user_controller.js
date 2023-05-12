const { session } = require('passport');
const User = require('../models/user');
const restpassmailer = require('../mailers/user_mailer')

//controller for just rendering sign-up form
module.exports.showAuthForm =async (req, res) => {
    try {

        let user = await User.findOne(req.body.email);
        return res.render('sign_up_page', {
            title: 'Sign-Up | Page',
            user
        })
    } catch (error) {
        console.log(error);
    }
   
}

//controller for creating user
module.exports.createUser =   async (req,res) => {
    try {

        let user =await User.findOne({email: req.body.email});

        if(!user) {

          const new_user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
          });
             new_user.password = new_user.generateHash(req.body.password);
             await new_user.save();

             console.log("New User Created !")

                return res.redirect('/user/sign-in');

        } else {

           return res.redirect('back')

        }

    } catch (error) {

        console.log('Error****', error);

        return res.status(500).json({
            message: 'Internal Server Error!'
        })
    }
}

// controller for rendering sign in page 
module.exports.signIn = (req, res) => {

    return res.render('sign-in-page', {
        title: 'Sign-In | Page'
    })
}


// controller for creating sessions
module.exports.createSession = function (req, res) {

    // req.flash('success', 'You have Logged-In !')
     if(req.isAuthenticated()) {
        return res.render('hometown', {
            title: 'Home | Town'
        });
     } else {
        req.flash('error', 'Invalid Username/Password!')
        return res.redirect('back')
     }    
    // return res.redirect('/user/hometown');
 }


 //for log out 
module.exports.destroySession = function (req, res) {

    // .logout() provided by the passport.js
    req.logout(function(err){
        req.session = session
      if(err){
        console.log("Something Went wrong !")
      }
    });
    //   req.flash('success', 'You have Logged-Out !')
     return res.redirect('/');
  };

  //for resetting password
module.exports.resetPassword =  (req, res) => {
    return res.render('reset_password', {
      title : 'Password | Reset',
      access : false
    });
  }

//sending reset pass link via mail
module.exports.resetPassMail = async (req, res) => {

    try {
  
      let user = await User.findOne({email : req.body.email});
      if(!user) {
  
        console.log('Error in finding user !')
        return res.redirect('back');
  
      }else{
  
        if(user.isTokenValid == false) {
          user.accessToken = require('crypto').randomBytes(32).toString('hex');
          user.isTokenValid = true,
          await user.save();  
        }

        restpassmailer.resetPassMail(user);

        req.flash('Password reset link send to Your mail. Click to reset password!');
        return res.redirect('/');
  
      }
    } catch (error) {
  
      req.flash('Error', 'User not found. Try again !');
      console.log('Error', error);
      return res.redirect('back');

    }
  }

  //for set password
module.exports.setPassword = async (req, res) => {
  try {

    let user = await User.findOne({accessToken : req.params.accessToken});
    // console.log(user)

    if(!user) {
      console.log('Error in finding user !');
      return;
    }

    if(user.isTokenValid) {

      return res.render('reset_password', {
        title : 'Codeial | Reset_password',
        access : true,
        accessToken : req.params.accessToken
      });

    }else {
      console.log('Error in rendering page !!!')
    }

  } catch (error) {

    req.flash('Error', 'Link Expired!!');
    console.log('Error', error);
    return res.redirect('/users/reset-password');

  }
}

// updating password to dataBase
module.exports.updatePassword = async (req, res) => {
  try {

    let user = await User.findOne({accessToken : req.params.accessToken});

    if(!user) {
      console.log('Error in finding User !!');
      return;
    }

    if(user.isTokenValid) {

      if( req.body.newPass == req.body.confirmPass ) {

        user.password = req.body.newPass;
        user.isTokenValid = false;
        user.save();
        req.flash('Success', 'Password updated. Login now !')
        return res.redirect('/user/sign-in');

      }else{

        req.flash('error', 'Password don not matched !');
        return res.redirect('back');

      }
    }else{

       req.flash('error', 'Link expired !')
       return res.redirect('/users/reset-password !');

    }
    
  } catch (error) {
    
    console.log('Error', error);

  }
}
   