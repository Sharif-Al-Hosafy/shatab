var express = require("express"),
  router = express.Router({ mergeParams: true }),
  Constructor = require("../models/constructor"), //beto3 el db fa baro7 ll files ele gowa el models
  User = require("../models/user"),
  Request = require("../models/constructorrequest"),
  nodemailer = require("nodemailer"),
  smtpTransport = require("nodemailer-smtp-transport");

//show new form for request
router.get("/constructors/:id/request/new", isLoggedIn, function (req, res) {
  Constructor.findById(req.params.id, function (err, constructor) {
    if (err) {
      console.log(err);
    } else {
      res.render("requests/new", { constructor: constructor });
    }
  });
});

var smtpTransport = nodemailer.createTransport(
  smtpTransport({
    service: "Gmail",
    auth: {
      user: "shatab.gp.2017sba@gmail.com",
      pass: "Sh@t@bGB",
    },
  })
);
//===============================================================================================================
router.post("/constructors/:id/request/", function (req, res) {
  Constructor.findById(req.params.id, function (err, constructor) {
    if (err) {
      console.log(err);
      res.redirect("/constructorhelp");
    } else {
      Request.create(req.body.request, function (err, request) {
        if (err) {
          console.log(err);
        } else {
          //add author and constructor to request
          request.To.id = constructor._id;
          request.To.name = constructor.name;
          request.To.email = constructor.email;
          request.author.id = req.user._id;
          request.author.username = req.user.username;
          request.author.Email = req.user.Email;
          request.text = req.body.requestText;

          var mailOptions = {
            from: '"Shatab" <agustina.will61@ethereal.email>', // sender address
            to: request.author.Email, // list of receivers
            subject: "Request", // Subject line
            text: "Constructor infromation ", // plaintext body
            html:
              "<h4>Constructor name is:</h4>" +
              constructor.name +
              "<h4>Constructor Email is:</h4>" +
              constructor.email +
              "<h4>Constructor address is:</h4>" +
              constructor.address +
              "<h4>Constructor phonenumber is:</h4>" +
              constructor.phonenumber +
              "<h4>Constructor price per hour is:</h4>" +
              constructor.pricePerHour,
          };
          smtpTransport.sendMail(mailOptions, function (error, info) {
            if (error) {
              return console.log(error);
            }
            console.log("Message 1 sent: " + info.response);
          });

          var mailOptions = {
            from: '"Shatab" <stanford22@ethereal.email>', // sender address
            to: constructor.email, // list of receivers
            subject: " New Request ", // Subject line
            text: "Client's information", // plaintext body
            html:
              "<h4>client name is:<h4>" +
              request.author.username +
              "<h4>client Email is:<h4>" +
              request.author.Email +
              "<h4>The request is :<h4>" +
              request.text,
          };
          smtpTransport.sendMail(mailOptions, function (error, info) {
            if (error) {
              return console.log(error);
            }
            console.log("Message 2 sent: " + info.response);
          });
          //save request
          request.save();
          req.flash("success", "Email Sent");
          res.redirect("/constructors/" + constructor._id);
        }
      });
    }
  });
});
//===============================================================================================================

//middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "Please Login First");
  res.redirect("/login");
}

module.exports = router;
