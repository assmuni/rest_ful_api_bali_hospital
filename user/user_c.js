const User = require('./user_m');
const bcrypt = require('bcryptjs');

exports.create = (req, res, next) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
            User.create({
                name: req.body.name,
                email: req.body.email,
                password: hash,
                permissionLevel: req.body.permissionLevel
            })
                .then(data => {
                    User.findOne({ email: data.email }, (err, data) => {
                        if (err) return res.status('401').json({ message: err.message });
                        res.status(201).json({
                            id: data._id
                        });
                    })
                }).catch(next);
        });
    })
}

exports.get_all = (req, res, next) => {
    User.find({}, { name: 1, dateCreated: 1 })
        .then(data => {
            res.status(200).json(data);
        })
        .catch(next);
}

// exports.update = (req, res, next) => {
//     // User.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
//     // User.findOneAndUpdate({ _id: req.params.id }, {$set: {'name': req.body.name, 'email': req.body.email}}, { new: true })
//     User.findOneAndUpdate({ _id: req.params.id }, {'name': req.body.name, 'email': req.body.email}, { new: true })
//         .then(data => {
//             res.send(data);
//         })
//         .catch(next)
// }

exports.update = (req, res, next) => {

    // keeping data when not change
    for (let key in req.body) {
        req.jwt[key] = req.body[key]
    }

    User.findOneAndUpdate({'_id': req.params.id}, {$set: {'name': req.jwt.name, 'email': req.jwt.email}}, {new: true})
        .then(data => {
            res.status(201).json(data);
        })
        .catch(next);
}

exports.delete = (req, res, next) => {
    User.findOneAndDelete({ _id: req.params.id }).then(data => {
        res.send(data);
    }).catch(next);
}