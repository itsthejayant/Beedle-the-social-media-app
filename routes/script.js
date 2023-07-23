const router = require('express').Router();
const handler = require('../controller/posts/script');

router.post('/addpost',handler.postaddpost);

module.exports= router;