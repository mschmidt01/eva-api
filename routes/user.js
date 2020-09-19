const express = require('express');
const User = require('../models/user');
const app = express();
const { v4: uuidv4 } = require('uuid');
const passport = require('passport');
const genPassword = require('../lib/passwordUtils').genPassword;
const isAuth = require('../middleware/authMiddleware').isAuth;

app.get('/users', async (req, res) => {
  const users = await User.find({});

  try {
    res.send(users);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/user', async (req, res) => {
    const user = new User(req.body);
  
    try {
      await user.save();
      res.send(user);
    } catch (err) {
      res.status(500).send(err);
    }
  });

  app.delete('/user/:id', async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id)
  
      if (!user) res.status(404).send("No item found")
      res.status(200).send()
    } catch (err) {
      res.status(500).send(err)
    }
  })

  app.patch('/user/:id', async (req, res) => {
    try {
      const user =  await User.findByIdAndUpdate(req.params.id, req.body)
      res.send(user)
    } catch (err) {
      res.status(500).send(err)
    }
  })

  app.post('/user/login', passport.authenticate('local', { failureRedirect: '/login-failure', successRedirect: 'login-success' }));

  app.post('/user/register', (req, res, next) => {
    User.findOne({ username: req.body.username }, function (err, user) {
        if (err) {
            res.send({
                status: "error",
                message: err.message
            })
        }
        if (user) {
            let result = {
                data: { title: 'Username existiert bereits.' },
                status: 'fail'
            }
            res.send(result)
        }
    });

    User.findOne({ email: req.body.email }, function (err, user) {
        if (err) {
            res.send({
                status: "error",
                message: err.message
            })
        }
        if (user) {
            let result = {
                data: { title: 'Email existiert bereits.' },
                status: 'fail'
            }
            res.send(result)
        }
    });

    const saltHash = genPassword(req.body.password);
    const salt = saltHash.salt;
    const hash = saltHash.hash;

    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        hash: hash,
        salt: salt,
    });

    newUser.save()
        .then(() => {
            res.send({
                status: 'success',
                data: null,
            })
        });
});

app.post('/user/forgot', (req, res, next) => {
    User.findOne({ email: req.body.email }, async function (err, user) {
        if (err) {
             res.send({
                status: "error",
                message: err.message
            }) 
        }
        if (user) {
             let token = uuidv4().substring(0, 8);
             let expiry = new Date(); 
             expiry.setMinutes(expiry.getMinutes() + 30);
             res.send({
                status: 'success',
                data: null,
            })
            let testAccount = await nodemailer.createTestAccount();

            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
              host: "smtp.ethereal.email",
              port: 587,
              secure: false, // true for 465, false for other ports
              auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass, // generated ethereal password
              },
            });
          
            // send mail with defined transport object
            let info = await transporter.sendMail({
              from: '"Framegame" <framegame@example.com>', // sender address
              to: "test@test.com", // list of receivers
              subject: "Password Reset Code", // Subject line
              text: `Your Password Reset Code: ${token} `, // plain text body
              html: `<b> Your Password Reset Code: ${token}</b>`, // html body
            });
          
            console.log("Message sent: %s", info.messageId);
          
            // Code wird nicht an die angebene Adresse versendet. Zum Testen URL verwenden.
            // TODO: In Production Mode smtp server verwenden!
            console.log("Code will not be deliverd!! Check Code here: %s", nodemailer.getTestMessageUrl(info));
            user.passwordResetToken = token;
            user.passwordResetTokenExpiryDate = expiry;
            user.save();
        } else{     
            let result = {  
                data: { title: 'Email existiert nicht.' },
                status: 'fail'
            }
            res.send(result)
            }
    });

});

app.post('/user/reset', (req, res, next) => {
    User.findOne({ email: req.body.email }, async function (err, user) {
        if (err) {
             res.send({
                status: "error",
                message: err.message
            }) 
        }
        if (user) {
             let token = user.passwordResetToken;
             let expiry = user.passwordResetTokenExpiryDate;
             let now = new Date();
             let diff = (now - expiry) * 1000;
             if(diff > 30){
                let result = {  
                    data: { title: 'Code ist abgelaufen.' },
                    status: 'fail'
                }
                res.send(result)
             } else{
                 if(token === req.body.token){
                    let saltHash = genPassword(req.body.newPassword);
                    let salt = saltHash.salt;
                    let hash = saltHash.hash;
                    user.salt = salt;
                    user.hash = hash;
                    user.save();
                    res.send({
                        status: 'success',
                        data: null,
                    })
                 } else {
                    let result = {  
                        data: { title: 'Code ist ungültig.' },
                        status: 'fail'
                    }
                    res.send(result)
                 }
             }
            
        } else{     
            let result = {  
                data: { title: 'Email existiert nicht.' },
                status: 'fail'
            }
            res.send(result)
            }
    });

});
app.get('/user/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

app.get('/user/login-success', (req, res, next) => {
    let result = {
        status: req.user ? 'success': 'fail',
        data: {
            message: req.user ? 'Login erfolgreich!': 'Login nicht erfolgreich!',
            username: req.user ? req.user.username : '',
        },
    }
    res.send(result)
});

app.get('/user/login-failure', (req, res, next) => {
    let result = {
        status: 'fail',
        data: { title: 'Login-Daten nicht korrekt.' }
    }
    res.send(result)
});

app.get('/protected-route', isAuth, (req, res, next) => {
    let result = {
        status: 'success',
        data: { title: 'Du bist User'+ req.user.username }
    }
    res.send(result)
});

module.exports = app