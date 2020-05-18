let express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose");
(passport = require("passport")),
  (LocalStrategy = require("passport-local")),
  (Constructor = require("./models/constructor")),
  (Comment = require("./models/comment")),
  (User = require("./models/user"));
(Request = require("./models/constructorrequest")),
  (Category = require("./models/category")),
  (Product = require("./models/product")),
  (Company = require("./models/company"));
session = require("express-session");
MongoStore = require("connect-mongo")(session);

//requiring routes
var authRoutes = require("./routes/user");
var categoryRoutes = require("./routes/category");
var commentRoutes = require("./routes/comments");
var constructorRoutes = require("./routes/constructors");
var requestRoutes = require("./routes/request");
var categoryRoutes = require("./routes/category");

//PASSPORT CONFIGUARTION
app.use(
  session({
    secret: "shatab",
    ressave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge: 180 * 60 * 1000 },
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect("mongodb://localhost/shatabProj");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public")); //mention the public directory from which we are serving the static files

app.use(authRoutes);
app.use(constructorRoutes);
app.use("/constructors/:id/comments", commentRoutes);
app.use(requestRoutes);
app.use(categoryRoutes);

/*Constructor.create({
   name:"c4",
  rating:"3/5",
  email:"amirasakr64@yahoo.com",
  address:"Ibrahemya",
  phonenumber:"01233336633",
 pricePerHour:"100LE",
});*/

app.get("/", function (req, res) {
  res.render("Landing");
});
app.get("/help", function (req, res) {
  res.redirect("/constructorhelp");
});
app.get("/shop", function (req, res) {
  res.redirect("/category");
});

app.listen(3000, function () {
  console.log("Listening !!!");
});