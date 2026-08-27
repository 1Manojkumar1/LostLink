const express = require('express');
const { createItem, getItems, getItemById, updateItem, deleteItem, getMyItems, getItemMatches, getMyMatches } = require('../controllers/itemController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/mine', auth, getMyItems);
router.get('/my-matches', auth, getMyMatches);
router.post('/', auth, createItem);
router.get('/', getItems);
router.get('/:id/matches', getItemMatches);
router.get('/:id', getItemById);
router.put('/:id', auth, updateItem);
router.delete('/:id', auth, deleteItem);

module.exports = router;