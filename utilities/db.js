const mongoose = require('mongoose');
require('dotenv').config()

mongoose.connect(process.env.MONGODB_URI);
  
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
});
