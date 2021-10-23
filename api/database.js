const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/todolist', {
  useUnifiedTopology: true,
  useNewUrlParser: true
})
  .then(() => console.log('Database is Connected'))
  .catch(err => console.log(err));




