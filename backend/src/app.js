require("dotenv").config();

const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const fetch = require("node-fetch"); // Node Fetch 3+ strictly is ES6 compliant so use node-fetch@2
const bcrypt = require("bcrypt");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const User = require("../models/user");
const Url = require("../models/url");
const Location = require("../models/location");

const { shortenURL } = require("../utils/utils");

const app = express();
app.set("view engine", "ejs");
app.set("trust proxy", true);
app.use(express.static("/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { NODE_ENV, PORT, DB_USER_PASSWORD, SESSION_SECRET } = process.env;

const nodeEnv = NODE_ENV || "development";
const port = PORT || 3000;
const dbURI = nodeEnv === "development" ? "mongodb://127.0.0.1:27017/url_shortener" : `mongodb+srv://root:${DB_USER_PASSWORD}@url-shortener.rheingq.mongodb.net/?retryWrites=true&w=majority`;
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(port))
  .catch(() => console.log("Connection failure!"));

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: dbURI }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);

app.get("/signin", (req, res) => {
  res.render("signin");
});

app.get("/signup", (req, res) => {
  res.render("signup", { data: { error: "" } });
});

app.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
  User.findOne({ email: email }, (error, user) => {
    if (user) {
      res.render("signup", { data: { error: "User already exists!" } });
    } else {
      const hashedPassword = bcrypt.hashSync(password, 10);
      if (hashedPassword) {
        const user = new User({
          name,
          email,
          password: hashedPassword,
        });
        user.save((error, result) => {
          if (error) res.render("signup", { data: { error: "User not created!" } });
          if (result) res.redirect("/signin");
        });
      }
    }
  });
});

app.post("/signin", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email: email }, (error, user) => {
    if (!user) {
      res.redirect("/signin");
    } else {
      const isValid = bcrypt.compareSync(password, user.password);
      if (isValid) {
        req.session.user_uid = user._id;
        res.redirect("/");
      } else {
        res.redirect("/signin");
      }
    }
  });
});

app.get("/signout", (req, res) => {
  req.session.destroy((error) => {
    if (error) return console.log("There was an error signin out..");
    res.redirect("/signin");
  });
});

app.get("/", (req, res) => {
  if (req.session.user_uid) {
    res.render("index");
  } else {
    res.redirect("/signin");
  }
});

app.get("/docs", (req, res) => {
  if (req.session.user_uid) {
    res.render("docs");
  } else {
    res.redirect("/signin");
  }
});

app.post("/api/url", (req, res) => {
  if (req.session.user_uid) {
    const { target, url } = req.body;
    if (url) {
      const result = shortenURL(14);
      let shortURL = `${req.hostname}/${result}`;
      if (nodeEnv === "development") {
        shortURL = `${req.hostname}:${port}/${result}`;
      }
      const urlInstance = new Url({ urlOwnerID: req.session.user_uid, urlTarget: target, urlOld: url, urlNew: shortURL });
      urlInstance.save((error, result) => {
        if (error) res.redirect("/");
        if (result) res.redirect("/urls");
      });
    } else {
      res.redirect("/");
    }
  } else {
    res.redirect("/signin");
  }
});

app.get("/urls", (req, res) => {
  if (req.session.user_uid) {
    Url.find({ urlOwnerID: req.session.user_uid }, {}, (error, result) => {
      if (error) console.log(error);
      if (result && result.length != 0) {
        res.render("urls", { data: { result } });
      } else {
        res.render("urls", { data: "" });
      }
    });
  } else {
    res.redirect("/signin");
  }
});

app.get("/stats/:id", (req, res) => {
  if (req.session.user_uid) {
    Location.find({ urlID: req.params.id }, (error, result) => {
      if (error) console.log(error);
      if (result && result.length != 0) {
        res.render("stats", { data: { locations: result } });
      } else {
        res.render("stats", { data: {} });
      }
    });
  } else {
    res.redirect("/signin");
  }
});

app.get("/:url", (req, res) => {
  if (req.session.user_uid) {
    let location;
    let url = req.params.url;
    if (nodeEnv === "development") {
      Url.findOne({ urlNew: `${req.hostname}:${port}/${url}` }, (error, result) => {
        if (error) return console.log(error);
        if (!result) {
          res.redirect("/");
        } else {
          location = new Location({
            urlID: result._id,
            urlTarget: result.urlTarget,
            ip: "192.168.1.1",
            continent: "Africa",
            country: "Uganda",
            region: "Central",
            city: "Kampala",
            latitude: 0.3476,
            longitude: 32.5825,
          });
          location.save((error, data) => {
            if (error) return console.log(error);
            if (data) {
              const urlToVisit = result.urlOld;
              res.redirect(urlToVisit);
            }
          });
        }
      });
    } else {
      Url.findOne({ urlNew: `${req.hostname}/${url}` }, (error, result) => {
        if (error) return console.log(error);
        if (!result) {
          res.redirect("/");
        } else {
          fetch(`http://ipwho.is/${req.ip}`)
            .then((response) => response.json())
            .then((data) => {
              location = new Location({
                urlID: result._id,
                urlTarget: result.urlTarget,
                ip: data.ip,
                continent: data.continent,
                country: data.country,
                region: data.region,
                city: data.city,
                latitude: data.latitude,
                longitude: data.longitude,
              });

              location.save((error, data) => {
                if (error) return console.log(error);
                if (data) {
                  const urlToVisit = result.urlOld;
                  res.redirect(urlToVisit);
                }
              });
            })
            .catch((error) => console.log(error));
        }
      });
    }
  } else {
    res.redirect("/signin");
  }
});
