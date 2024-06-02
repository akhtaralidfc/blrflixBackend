const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const userRoutes = require('./routes/userRoutes');
// const movieListRoutes = require('./routes/movieLists');
const movieRoutes = require('./routes/movieRoutes');
const request = require('request');
const List = require('./models/List');


app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/api/omdb', (req, res) => {
  const apiUrl = `http://www.omdbapi.com/?apikey=${process.env.API_KEY}&s=${req.query.s}`;
  request(apiUrl).pipe(res);
});
app.use('/api/users', userRoutes);
app.use('/api/lists', movieRoutes);


mongoose.connect(`${process.env.MONGO_URL}/MovieApp`,{ useNewUrlParser: true }).then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Database connection error:', err);
});