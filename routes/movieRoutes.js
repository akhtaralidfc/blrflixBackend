const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getLists, createList, addMovieToList, searchList } = require('../controllers/movieController');

const router = express.Router();

router.route('/').get(protect, getLists).post(protect, createList);

router.route('/:id/addMovie').put(protect, addMovieToList);

router.route('/search/:listId').get(protect, searchList);  

module.exports = router;

