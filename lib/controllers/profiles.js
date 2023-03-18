const { Router } = require('express');
const Profile = require('../models/Profile.js');

module.exports = Router().post('/', async (req, res, next) => {
  try {
    const profile = await Profile.insert(req.body);
    res.json(profile);
  } catch (e) {
    next(e);
  }
});
