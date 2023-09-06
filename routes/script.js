const router = require('express').Router();
const handler = require('../controller/posts/script');

router.get('/test',handler.j);

module.exports= router;