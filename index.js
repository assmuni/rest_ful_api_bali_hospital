const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

mongoose.connect('mongodb://localhost/portofolio', { useNewUrlParser: true });
// mongoose.connect('mongodb://userHospital:hospital123@ds157509.mlab.com:57509/portofolio', { useNewUrlParser: true });

// mongoose.Promise = global.Promise;

// middleware bodyparser
app.use(bodyParser.json());

// middleware_routing
app.use('/api/v2.0', require('./user/user_r'));
app.use('/auth', require('./middlewares/auth_r'));
app.use('/api/v2.0', require('./hospital/hospital_r'));

// middleware_error_handling
app.use((err, req, res, next) => {
    // console.log(err);
    res.status('422').send({error: err.message});
});

app.get('/', (req, res) => {
    res.json({message: 'connected'});
});

app.listen(process.env.PORT || 3000, function () {
    console.log("Express server listening on port", this.address().port);
});