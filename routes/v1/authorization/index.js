const express = require('express');
const router = express.Router();
const { setAuthenticationResponse, logout } = require('./functions');

router.post('/', (req, res) => {
  try {
    const authenticationResponse = setAuthenticationResponse();
    res.send(authenticationResponse);
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

router.post('/logout', (req, res) => {
  try {
    logout()
    res.status(200).json({ success: true })
  } catch (error) {
    res.status(500).json({ success: false });
  }
})

router.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false });
});

module.exports = router;
