const express = require('express');
const router = express.Router();
const Model = require('../models/participationmodel.js');
const verifyToken = require('./verifyToken.js');

router.post('/add', verifyToken, (req, res) => {
    req.body.user = req.user._id;
    console.log(req.body);

    new Model(req.body).save()
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((err) => {
            console.log(err);
            if (err.code === 11000) {
                res.status(500).json({ message: 'Data already exist' });
            } else {
                res.status(500).json({ message: 'Internal Server Error' });
            }
        });
});

router.get('/getbycompetition/:competition', (req, res) => {
    Model.find({ competition: req.params.competition }).populate('blog').populate('user')
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.get('/getbyid/:id', (req, res) => {
    Model.findById(req.params.id)
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.delete('/delete/:id', (req, res) => {
    Model.findByIdAndDelete(req.params.id)
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.get('/getall', (req, res) => {

    Model.find()
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.post('/check-participation', verifyToken, (req, res) => {
    const { comp } = req.body;
    const { _id } = req.user;
    Model.findOne({ competition: comp, user: _id })
        .then((result) => {
            if (result) return res.status(200).json(result);
            else return res.status(203).json({ message: 'participation not found' });
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
})

module.exports = router;
