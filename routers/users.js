const express = require('express');
const router = express.Router();
const passport = require('passport');


const userController = require('../controllers/user_controller');

// router for geting sign up page
router.get('/sign-up', userController.showAuthForm);

// router for cteating user
router.post('/create-user', userController.createUser);

//router for sign-in page
router.get('/sign-in', userController.signIn);

// for reset password page
router.get('/reset-pass-page', userController.resetPassword);

// sendig reset-password-mail
router.post('/send-reset-pass-mail', userController.resetPassMail);

// accessing page for reset password
router.get('/reset-password/:accessToken', userController.setPassword);

// for reset-password
router.post('/update-password/:accessToken', userController.updatePassword);

// router for creating sessions
router.post('/create-session', 
  passport.authenticate('local', { failureRedirect: '/user/sign-in' }),
  function(req, res) {
    return res.render('hometown', {
      title: 'Home | Town'
  });;
  }, userController.createSession);

//   for sign out
  router.get('/sign-out', userController.destroySession);

//routes for google sign-in | sign-up
router.get('/auth/google', passport.authenticate('google', {scope:['profile', 'email']}));
router.get('/auth/google/callback', passport.authenticate(
  'google',
  {failureRedirect : '/user/sign-in'}
), userController.createSession);

module.exports = router;