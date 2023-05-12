const nodeMailer = require('../config/nodemailer');

exports.resetPassMail = (user) => {

    try {
            // console.log('inside newComment mailer');

//for sending ejs in mail
    let htmlString =nodeMailer.renderTemplate({user: user}, '/user/usermailer.ejs');

    let info = nodeMailer.transporter.sendMail({      
         from : process.env.user_email,
         to : user.email,
         subject :'Reset Your Password !',
         html : htmlString
     }, function(err, data) {
         if(err){
             console.log('Error', err)
         } else {
             console.log('Email Send', data);
         }
     });
     if(!info) {
         console.log('Error in sending mail !');
         return;
     }
     console.log('Message send :', info);
     return
    } catch (error) {
        console.log('Error', error)
    }
};

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