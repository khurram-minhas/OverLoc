require('dotenv').config();
const connection = require('./config/database');
const express = require('express');
var cors = require('cors')
var bcrypt = require('bcryptjs');
const app = express();
const jwtToken = require('jsonwebtoken');
const auth = require('./middleware/auth');
app.use(cors())
app.use(express.json());

app.post('/welcome', auth, (req, res) => {
  res.status(200).send('Welcome 🙌 ');
});

app.post('/login', async (req, res) => {
  try {
    // Get user input
    const { username, password } = req.body;
    // Validate user input
    if (!(username && password)) {
      res.status(400).send('All input is required');
    }

    //Encrypt user password
    const query = "Select * from usercredentials where username = '" + username + "'";
    const responseUsers = await connection.connect(query);
    if (responseUsers.hasError) res.status(400).json(responseUsers.error);
    if (responseUsers.result.length === 0) res.status(401).json('Unauthorized user!');
    const isValidPassword = (await bcrypt.compare(password, responseUsers.result[0].Password));
    console.log(isValidPassword)
    if(!isValidPassword)  res.status(401).json('Invalid Password!');
    // Get user from our database
    const user = { _id: 1 };

    // Create token
    const token = jwtToken.sign(
      { id: user._id, username },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1h' }
    );
    // save user token
    user.token = token;
    res.status(201).json(user);
    // stop further execution in this callback
    return;
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});

app.post('/getAllCountries', auth, async (req, res) => {
  const response = await connection.connect('Select * from Country');
  if (response.hasError) res.status(400).json(response.error);
  else res.status(200).json(response.result);
});
app.post('/getAllUserAds', auth, async (req, res) => {
  const response = await connection.connect('Select * from UserAds');
  if (response.hasError) res.status(400).json(response.error);
  else res.status(200).json(response.result);
});
app.post('/insertCountries', auth, async (req, res) => {
  const response = await connection.connect(
    "INSERT INTO Country (name) VALUES ('" + req.body.name + "')"
  );
  if (response.hasError) res.status(400).json(response.error);
  else res.status(200).json(response.result);
});

app.post('/insertUser', async (req, res) => {
  const response = await connection.connect(
    "INSERT INTO users (name, email, address, city, longitude, latitude, zipcode, phonenumber, countryid ) VALUES ('" +
      req.body.name +
      "'," +
      "'" +
      req.body.email +
      "'," +
      "'" +
      req.body.address +
      "'," +
      "'" +
      req.body.city +
      "'," +
      "'" +
      req.body.longitude +
      "'," +
      "'" +
      req.body.latitude +
      "'," +
      "'" +
      req.body.zipcode +
      "'," +
      "'" +
      req.body.phonenumber +
      "'," +
      "'" +
      req.body.countryid +
      "'" +
      ')'
  );
  if (response.hasError) res.status(400).json(response.error);
  const responseUsers = await connection.connect("Select * from Users where email = '" + req.body.email + "'");
  if (responseUsers.hasError) res.status(400).json(responseUsers.error);
  let encryptedPassword = await bcrypt.hash(req.body.password, 10);
  const responseUserInsert = await connection.connect(
    "INSERT INTO UserCredentials (userid, username, password) VALUES ('" +
    responseUsers.result[0].ID +
    "'," +
    "'" +
    req.body.username +
    "'," +
    "'" +
    encryptedPassword +
    "'" +
    ')'
  );
  if (responseUserInsert.hasError) res.status(400).json(responseUserInsert.error);
  else res.status(200).json(responseUserInsert.result);
});

app.post('/insertUserAds', auth, async (req, res) => {
  const response = await connection.connect(
    "INSERT INTO userads (userId, city, description, weeksinmonth, pricepermonth, zipcode ) VALUES ('" +
      req.body.userId +
      "'," +
      "'" +
      req.body.city +
      "'," +
      "'" +
      req.body.description +
      "'," +
      "'" +
      req.body.weeksinmonth +
      "'," +
      "'" +
      req.body.pricepermonth +
      "'," +
      "'" +
      req.body.zipcode +
      "'" +
      ')'
  );
  if (response.hasError) res.status(400).json(response.error);
  else res.status(200).json(response.result);
});
module.exports = app;
