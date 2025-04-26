const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('680bbc0a77324528b0360a8b')
    .then(user => {
      req.user = user;
      console.log(req.user)
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    'mongodb+srv://akash:17082001@cluster0.fo2hosk.mongodb.net/Shop?retryWrites=true&w=majority&appName=Cluster0'
  )
  .then(() => {
    return User.findOne();
  })
  .then(user => {
    if (!user) { 
      const newUser = new User({
        name: 'Akash',
        email: 'Akash@gmail.com',
        cart: { items: [] }
      });
      return newUser.save();
    }
  })
  .then(() => {
    app.listen(3000, () => {
      console.log('🚀 Server started on http://localhost:3000');
    });
  })
  .catch(err => {
    console.log('❌ Error connecting to MongoDB:', err);
  });
