# nodejs_auth_system

This project is going to authenticate you how you are secure in today's world of internet 
MVC architecture and Technologies used ------>
      ROOT_FOLDER===models----> Mongodb [SCHEMA SETUP]
               |
                ==== Views-----> EJS ---> for front-end
               |
               ======controllers----> for sending and recieving request and response from server----> Express-server
               |
               =======routers-------> it calls related controllers via specified path when button clicked
               |
               =======mailers--------> it used to send mails to the user when he/she wants to reset theirs password
               |         |
               |      By using nodemailer-library
               |
               ========config--------> for accessing third party apps likes- google oauth, passport, passport-locals etc.
               |
               =========index.js ------> just for triggring the start server method of server.js
               |
               =========server.js-------> method for start server and importing diffent libraries which supports to run my app
   **Start Project in your Locals**
                |
                -------> 1. **First you need to setup your environment variables**
                         2. **Pass command---npm install**
                         3. **pass command---npm start**
                         
    **when deploying my app on render.com facing some issues---->**
          |
          ------>when i log-in via google or sign-up it shows #Invalid_user 401 error while it runs perfectaly in my locals
                        |
                        for this i have again configure my client_id, client_secret on console.developers.google.com and sets new still
                           error not gone
     **hosted_url**:-------https://auth2yourself.onrender.com
              
