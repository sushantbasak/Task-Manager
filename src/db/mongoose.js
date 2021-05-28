const mongoose = require('mongoose');
const validator = require('validator');

mongoose.connect(
  process.env.MONGO_URL,
  {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  },
  () => console.log('Database Connected!')
);
