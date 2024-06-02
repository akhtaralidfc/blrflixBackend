const axios = require('axios');
// const MovieList = require('../models/MovieList');
const List = require('../models/List');

const getMovies = async (req, res) => {
  const { query } = req.query;
  try {
    const response = await axios.get(`http://www.omdbapi.com/?s=${query}&apikey=c072cca2`);

    console.log(response);
    res.json(response.data);
  } catch (error) {
    console.log('Failed to fetch movies');
    res.status(500).json({ message: 'Failed to fetch movies' });
  }
};


const getLists = async (req, res) => {
  const lists = await List.find({ user: req.user._id });
  res.json(lists);
};

const createList = async (req, res) => {
  const { name, movies, visibility } = req.body;
  const list = new List({
    user: req.user._id,
    name,
    movies,
    visibility
  });
  const createdList = await list.save();
  res.status(201).json(createdList);
};

const addMovieToList = async (req, res) => {
  const list = await List.findById(req.params.id);

  if (list) {
    list.movies.push(req.body.movie);
    const updatedList = await list.save();
    res.json(updatedList);
  } else {
    res.status(404).json({ message: 'List not found' });
  }
};

const searchList=async(req,res)=>{
  console.log("Search started")
  try {
    const list = await List.findById(req.params.listId).populate('movies');
    // console.log("List.user: "+list.user.toString());
    // console.log(req.user)
    
    if (list.visibility === 'private') {
      
      if(list.user.toString() !== req.user._id.toString()){
        return res.status(403).json({ message: 'This list is private' });
      }else{
        res.json(list);
      }
    }else{
       res.json(list);
    }
  } catch (error) {
    res.status(404).json({ message: 'List not found' });
  }
};

// const searchList = async (req, res) => {
//   console.log("Search started");
//   try {
//     const list = await List.findById(req.params.listId).populate('movies');
//     if (!list) {
//       return res.status(404).json({ message: 'List not found' });
//     }

//     if (list.visibility === 'private') {
//       // Check for authorization header
//       const authHeader = req.headers.authorization;
//       console.log(authHeader);
//       if (!authHeader || !authHeader.startsWith('Bearer')) {
//         return res.status(401).json({ message: 'Not authorized, no token' });
//       }

//       // Verify token
//       console.log("Reacher here")
//       var token = authHeader.split(' ')[1];
//       token = token.replace(/^"|"$/g, '');
//       console.log("Token: "+token);
//       try {
//         console.log("verif start")
//         const decoded = jwt.verify(token, 'your_jwt_secret');
//         console.log("Reacher inside")
//         req.user = await User.findById(decoded.id).select('-password');

//         if (!req.user) {
//           return res.status(401).json({ message: 'Not authorized, user not found' });
//         }

//         // Check if the user is the owner of the list
//         if (list.user.toString() !== req.user._id.toString()) {
//           return res.status(403).json({ message: 'This list is private' });
//         }

//         // User is authorized
//         res.json(list);
//       } catch (error) {
//         return res.status(401).json({ message: 'Not authorized, token failed' });
//       }
//     } else {
//       // Public list, no authorization needed
//       res.json(list);
//     }
//   } catch (error) {
//     res.status(404).json({ message: 'List not found' });
//   }
// };

module.exports = { getLists, createList, addMovieToList, searchList };

