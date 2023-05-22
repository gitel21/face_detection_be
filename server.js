const express = require ('express');
const bodyParser = require ('body-parser');
const bcrypt = require ('bcrypt');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const app = express();

const db = knex({
   client: 'pg',
   connection: {
     host : '127.0.0.1', 
     user : 'eileenli',
     password : '',
     database : 'face-detection'
   }
 });

app.use(bodyParser.json());
app.use(cors());

app.post('/signin', signin.handleSignin(db, bcrypt))

app.post('/register', register.handleRegister(db, bcrypt))

app.get('/profile/:id', profile.handleProfileGet(db))

app.put('/image', image.handleImage(db))

app.post('/imageurl', image.handleApiCall())

const PORT = process.env.PORT;
app.listen(PORT, ()=> {
   console.log(`app is running on port ${PORT}`)
})