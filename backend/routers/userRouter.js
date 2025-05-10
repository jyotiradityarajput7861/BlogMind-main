const express = require('express');
const router = express.Router();
const Model = require('../models/usermodel.js');
const jwt = require('jsonwebtoken');
const verifyToken = require('./verifyToken.js');
const verifyAdmin = require('../utils/verifyAdmin');
const bcrypt=require('bcrypt');


require('dotenv').config();

router.post('/add', (req, res) => {

    console.log(req.body);

    new Model(req.body).save()
        .then((result) => {

            res.status(200).json(result);
        })
        .catch((err) => {
            console.log(err);
            if (err.code === 11000) {
                res.status(500).json({ message: 'Email Already Exists' });
            } else {
                res.status(500).json({ message: 'Internal Server Error' });
            }
        });
});
router.post('/give-coins', async (req, res) => {
    const { userId, coins } = req.body;

    if (!userId || !coins) return res.status(400).json({ error: "User ID and coins are required" });

    try {
        const user = await Model.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        user.coins += coins; // Add coins to the user's balance
        await user.save();

        res.status(200).json({ message: "Coins added successfully", coins: user.coins });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});


// Route to fetch coin balance using token
router.get('/balance', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        res.status(200).json({ coins: user.coins });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});



router.get('/admin/getall', verifyAdmin, (req, res) => {
    Model.find()
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});


// getall
router.get('/getall', (req, res) => {

    Model.find()
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
})

// : denotes url parameter
router.get('/getbyemail/:email', (req, res) => {

    console.log(req.params.email);

    Model.findOne({ email: req.params.email })
        .then((result) => {
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ message: 'User Not Found' });
            }
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

router.put('/update/:id', (req, res) => {
    Model.findByIdAndUpdate(req.params.id, req.body, { new: true })
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

router.get('/getbyuser', verifyToken, (req, res) => {
    Model.findById(req.user._id)
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

// router.post('/authenticate', (req, res) => {
//     Model.findOne(req.body)
//         .then((result) => {

//             if (result) {
//                 // generate token
//                 const { _id, email, password, role } = result;
//                 const payload = { _id, email, password, role };

//                 jwt.sign(
//                     payload,
//                     process.env.JWT_SECRET,
//                     { expiresIn: '1 days' },
//                     (err, token) => {
//                         if (err) {
//                             console.log(err);

//                             res.status(500).json({ message: 'Token Generation Failed' });
//                         } else {
//                             res.status(200).json({ token: token, email, role });
//                         }
//                     }
//                 )

//             } else {
//                 res.status(401).json({ message: 'Invalid Credentials' });
//             }

//         }).catch((err) => {
//             console.log(err);
//             res.status(500).json(err);
//         });
// })
router.post('/authenticate', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await Model.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const payload = {
            _id: user._id,
            email: user.email,
            role: user.role,
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' }, (err, token) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: 'Token generation failed' });
            } else {
                res.status(200).json({ token, email: user.email, role: user.role });
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


module.exports = router;