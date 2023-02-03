//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
const { get } = require('request');
const ejs = require('ejs');
const _ = require('lodash');
const mongoose = require('mongoose');
const port = process.env.PORT || 2711;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

const JWT_SECRET = 'vbhjwi763892euiyvb9087rfvecbioi20989e13!@(&#Biob';

app.set('view engine', 'ejs');

app.use(express.static('Public'));
app.use(express.static(__dirname + '/Public'));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.set('strictQuery', false);

mongoose.connect('mongodb://127.0.0.1:27017/brogrammersDB', {
  keepAlive: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const nptel_courseSchema = new mongoose.Schema({
  nptel_name: String,
  week: String,
  question_1: String,
  answer_1: String,
  question_2: String,
  answer_2: String,
  question_3: String,
  answer_3: String,
  question_4: String,
  answer_4: String,
  question_5: String,
  answer_5: String,
  question_6: String,
  answer_6: String,
  question_7: String,
  answer_7: String,
  question_8: String,
  answer_8: String,
  question_9: String,
  answer_9: String,
  question_10: String,
  answer_10: String,
});
const Nptel = mongoose.model('Nptel', nptel_courseSchema);

const userSchema = new mongoose.Schema({
  admin_name: { type: String, required: true },
  admin_user_name: { type: String, required: true, unique: true },
  admin_email: { type: String, required: true },
  admin_password: { type: String, required: true },
});
const User = mongoose.model('User', userSchema);

app
  .route('/')
  .get(function (req, res) {
    res.render('home');
  })
  .post(function (req, res) {
    var email = req.body.email;
    console.log(email);
    if (res.statusCode === 200) {
      console.log('email logged');
    } else {
      res.render('error');
    }
  });

app
  .route('/admin')
  .get(function (req, res) {
    res.render('admin');
  })
  .post(async function (req, res) {
    if (
      !req.body.admin_username ||
      typeof req.body.admin_username !== 'string'
    ) {
      return res.json({ status: error, error: 'Invalid Username' });
    }
    if (
      !req.body.admin_password ||
      typeof req.body.admin_password !== 'string'
    ) {
      return res.json({ status: error, error: 'Invalid Username' });
    }
    const password = req.body.admin_password;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new User({
      admin_name: req.body.admin_name,
      admin_user_name: req.body.admin_username,
      admin_email: req.body.admin_email,
      admin_password: hashedPassword,
    });
    newAdmin.save(function (err) {
      if (!err) {
        // res.send('seccefully added the data');
        res.redirect('/admin');
      } else {
        if (err.code === 11000) {
          return res.json({
            status: 'error',
            error: 'User name already in use',
          });
        }
      }
    });
  })
  .delete();

app
  .route('/login')
  .get(function (req, res) {
    res.render('admin');
  })
  .post(async function (req, res) {
    const admin_userName = req.body.login_username;
    console.log(admin_userName);
    const login_pass = req.body.login_password;
    const user = await User.findOne({ admin_user_name: admin_userName }).lean();
    console.log(user);
    if (!user) {
      return res.json({ status: 'error', error: 'Invalid username/Password' });
    }
    if (await bcrypt.compare(login_pass, user.admin_password)) {
      //the username, password combination is successful

      const token = jwt.sign(
        {
          id: user._id,
          username: user.admin_user_name,
        },
        JWT_SECRET
      );
      return res.redirect('/composeNPTEL');
      // return res.json({ status: 'ok', data: token });
    }
    res.json({ status: 'error', error: 'Invalid Usernam/Password' });
  });

app
  .route('/composeNPTEL')
  .get(function (req, res) {
    res.render('composeNPTEL');
  })
  .post(function (req, res) {
    const newNPTEL = new Nptel({
      nptel_name: req.body.nptel_courseName,
      week: req.body.weekNumber,
      question_1: req.body.question_1,
      answer_1: req.body.answer_1,
      question_2: req.body.question_2,
      answer_2: req.body.answer_2,
      question_3: req.body.question_3,
      answer_3: req.body.answer_3,
      question_4: req.body.question_4,
      answer_4: req.body.answer_4,
      question_5: req.body.question_5,
      answer_5: req.body.answer_5,
      question_6: req.body.question_6,
      answer_6: req.body.answer_6,
      question_7: req.body.question_7,
      answer_7: req.body.answer_7,
      question_8: req.body.question_8,
      answer_8: req.body.answer_8,
      question_9: req.body.question_9,
      answer_9: req.body.answer_9,
      question_10: req.body.question_10,
      answer_10: req.body.answer_10,
    });
    newNPTEL.save(function (err) {
      if (!err) {
        res.redirect('/nptel');
        // res.send("seccefully added the data");
      } else {
        res.send(err);
      }
    });
  })
  .delete();

app.get('/nptel', function (req, res) {
  Nptel.find(function (err, foundNptels) {
    if (!err) {
      res.render('nptel', {
        foundNptels: foundNptels,
      });
    } else {
      res.send(err);
    }
  });
});

app.get('/contact', function (req, res) {
  res.render('contact');
});
app.get('/sem1', function (req, res) {
  res.render('semester');
});

app.get('/nptel/:nptel_courseName', function (req, res) {
  Nptel.find(
    { nptel_name: req.params.nptel_courseName },
    function (err, foundNptels) {
      if (!err) {
        res.render('nptel_week', {
          foundNptels: foundNptels,
          CourseTitle: req.params.nptel_courseName,
        });
      } else {
        res.render('error');
      }
    }
  );
});

app.get('/nptel/:courseName/:weekNumber', function (req, res) {
  Nptel.findOne(
    {
      nptel_name: req.params.courseName,
      week: req.params.weekNumber,
    },
    function (err, foundAnswers) {
      if (!err) {
        res.render('nptel_weeksAnswer', {
          foundAnswers: foundAnswers,
        });
      } else {
        res.render('error');
      }
    }
  );
});

app.get('/:url', function (req, res) {
  res.render('error');
});

app.get('/semester', function (req, res) {
  res.render('semester');
});

app.listen(port, function () {
  console.log('server started at port 2711');
});
