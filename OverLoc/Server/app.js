require('dotenv').config();
const connection = require('./config/database');
const express = require('express');
var cors = require('cors');
var bcrypt = require('bcryptjs');
const app = express();
const jwtToken = require('jsonwebtoken');
const auth = require('./middleware/auth');
const { response } = require('express');
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
app.use(cors());
app.use(express.json());

app.get('/welcome', auth, async (req, res) => {
  // res.status(200).json('Welcome 🙌 ');
  res.status(200).json('Hello');
});

app.post('/login', async (req, res) => {
  // Validate user input
  let statusCode = 200,
    status = '',
    returningResponse = {};
  try {
    // Get user input
    const { email, password } = req.body;
    if (!(email && password)) {
      status = 'All input is required';
      statusCode = 400;
    }
    if (statusCode === 200) {
      //Encrypt user password
      const query = "Select * from users where email = '" + email + "'";
      const responseUsers = await connection.connect(query);
      if (responseUsers.hasError) {
        status = responseUsers.error;
        statusCode = 400;
      }
      const isValidPassword = await bcrypt.compare(
        password,
        responseUsers.result[0].Password
      );
      if (!isValidPassword) {
        statusCode = 401;
        status = 'Invalid Password!';
      }
      if (statusCode === 200) {
        if (!responseUsers.result[0].Email) {
          status = 'Unauthorized user!';
          statusCode = 400;
        }
        if (statusCode === 200) {
          const user = { userTypeId: 1, token: '', userId: 1 };

          // Create token
          const token = jwtToken.sign(
            { id: responseUsers.result[0].UserTypeId, email },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h' }
          );
          // save user token
          user.token = token;
          user.userTypeId = responseUsers.result[0].UserTypeId;
          user.userId = responseUsers.result[0].ID;
          returningResponse = user;
        }
      }
      // stop further execution in this callback
    }
  } catch (err) {
    console.log(err);
    returningResponse = {};
    statusCode = 401;
  }
  if (statusCode === 200) res.status(statusCode).json(returningResponse);
  else res.status(statusCode).json(status);
});

app.post('/getUser', auth, async (req, res) => {
  const response = await connection.connect(
    "Select * from Users where id = '" + req.body.userId + "'"
  );
  if (response.hasError) res.status(400).json(response.error);
  else res.status(200).json(response.result);
});
app.post('/reportAd', auth, async (req, res) => {
  const response = await connection.connect(
    "Select * from reportedAds where adId = '" +
      req.body.adId +
      "' and userId = '" +
      req.body.userId +
      "'"
  );
  if (!response.hasError) {
    if (response.result.length === 0) {
      const insertQuery =
        "INSERT INTO ReportedAds (userId, adId) VALUES ('" +
        req.body.userId +
        "', '" +
        req.body.adId +
        "')";
      const responseInsert = await connection.connect(insertQuery);
      if (responseInsert.hasError) res.status(400).json(responseInsert.error);
    }
    res.status(200).json({ success: true });
  } else {
    res.status(400).json(response.error);
  }
});
app.post('/getUser', auth, async (req, res) => {
  const response = await connection.connect(
    "Select * from Users where id = '" + req.body.userId + "'"
  );
  if (response.hasError) res.status(400).json(response.error);
  else res.status(200).json(response.result);
});
app.get('/isValidToken', auth, async (req, res) => {
  res.status(200).json(response.result);
});
app.get('/getAllUserAds', async (req, res) => {
  const response = await connection.connect(
    'select uAd.*, u.FirstName, u.profilePic, u.Email from UserAds as uAd join Users as u on uAd.UserId = u.ID where approveStatus = 1'
  );
  if (response.hasError) res.status(400).json(response.error);
  else res.status(200).json(response.result);
});
app.post('/getUserAds', auth, async (req, res) => {
  const response = await connection.connect(
    `select users.FirstName, users.profilePic, userads.* from userads join users on userads.UserId = users.Id where UserAds.userId = ${req.body.id}`
  );
  if (response.hasError) res.status(400).json(response.error);
  else res.status(200).json(response.result);
});
app.post('/approveAd', auth, async (req, res) => {
  const response = await connection.connect(
    'UPDATE UserAds SET approvestatus= 1 WHERE id = ' + req.body.id
  );
  if (response.hasError) res.status(400).json(response.error);
  else res.status(200).json({ sucess: true });
});
app.post('/uploadImage', auth, async (req, res) => {
  const response = await connection.connect(
    "UPDATE Users SET profilePic = '"+ req.body.url + "' WHERE id = " + req.body.id
  );
  if (response.hasError) res.status(400).json(response.error);
  else res.status(200).json({ sucess: true });
});
app.post('/deleteAd', auth, async (req, res) => {
  const response = await connection.connect(
    "DELETE FROM ReportedAds WHERE AdId='" + req.body.id + "'"
  );
  if (response.hasError) res.status(400).json(response.error);
  else {
    const responseDeleteAd = await connection.connect(
      "DELETE FROM UserAds WHERE Id='" + req.body.id + "'"
    );
    if (responseDeleteAd.hasError) res.status(400).json(responseDeleteAd.error);
    else res.status(200).json({ sucess: true });
  }
});
app.get('/getAllReportedAds', auth, async (req, res) => {
  const response = await connection.connect(
    'select userads.*, users.FirstName, users.ProfilePic from ReportedAds join UserAds on ReportedAds.AdId = UserAds.Id  join Users on UserAds.UserId = Users.ID'
  );
  if (response.hasError) res.status(400).json(response.error);
  else res.status(200).json(response.result);
});
app.get('/getAllUnApprovedAds', auth, async (req, res) => {
  const response = await connection.connect(
    'select users.FirstName,users.ProfilePic, UserAds.* from userads join users on UserAds.UserId = Users.Id where UserAds.approvestatus = 0'
  );
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
  let encryptedPassword = await bcrypt.hash(req.body.password, 10);
  let uni = req.body.university.replace("'", "''")
  const query =
    "INSERT INTO users (firstName, email, dob, university, gender, userTypeId, password ) VALUES ('" +
    req.body.firstName +
    "'," +
    "'" +
    req.body.email +
    "'," +
    "'" +
    req.body.dob +
    "'," +
    "'" +
    uni +
    "'," +
    "'" +
    req.body.gender +
    "'," +
    "'" +
    req.body.userTypeId +
    "'," +
    "'" +
    encryptedPassword +
    "'" +
    ')';
    console.log(query)
  const response = await connection.connect(query);
  if (response.hasError) res.status(400).json(response.error);
  else {
    const query = "Select * from users where email = '" + req.body.email + "'";
    const responseUsers = await connection.connect(query);
    if (response.hasError) res.status(400).json(response.error);
    else res.status(200).json(responseUsers.result);
  }
});

app.post('/insertUserAds', auth, async (req, res) => {
  const query =
    "INSERT INTO userads (userId, title, phoneCode, phoneNumber, weeksInMonth, areaOfApartment, description, startDate, minEstimatedBudget, maxEstimatedBudget, approveStatus, apartmentType ) VALUES ('" +
    req.body.userId +
    "'," +
    "'" +
    req.body.title +
    "'," +
    "'" +
    req.body.phoneCode +
    "'," +
    "'" +
    req.body.phoneNumber +
    "'," +
    "'" +
    req.body.weeks +
    "'," +
    "'" +
    req.body.areaOfApartment +
    "'," +
    "'" +
    req.body.description +
    "'," +
    "'" +
    req.body.startDate +
    "'," +
    "'" +
    req.body.minEstimatedBudget +
    "'," +
    "'" +
    req.body.maxEstimatedBudget +
    "'," +
    "'" +
    0 +
    "'," +
    "'" +
    req.body.apartmentType +
    "'" +
    ')';

  const response = await connection.connect(query);
  if (response.hasError) res.status(400).json(response.error);
  else res.status(200).json({ success: true });
});

app.post('/updateUserAd', auth, async (req, res) => {
  const query =
    `Update userads Set title='${req.body.title}', 
    phoneCode='${req.body.phoneCode}',
    phoneNumber='${req.body.phoneNumber}',
    weeksInMonth='${req.body.weeks}',
    areaOfApartment='${req.body.areaOfApartment}',
    description='${req.body.description}',
    startDate='${req.body.startDate}',
    minEstimatedBudget='${req.body.minEstimatedBudget}',
    maxEstimatedBudget='${req.body.maxEstimatedBudget}',
    approveStatus='0',
    apartmentType='${req.body.apartmentType}' where id = '${req.body.id}'`
  const response = await connection.connect(query);
  if (response.hasError) res.status(400).json(response.error);
  else res.status(200).json({ success: true });
});

app.post('/updateuser', auth, async (req, res) => {
  const query =
    `Update users Set firstname='${req.body.firstName}', 
    dob='${req.body.dob}',
    university='${req.body.university}',
    gender='${req.body.gender}',
    email='${req.body.email}' where id = '${req.body.id}'`
  const response = await connection.connect(query);
  if (response.hasError) res.status(400).json(response.error);
  else res.status(200).json({ success: true });
});
module.exports = app;
