const express = require('express');
const app = express();
require('dotenv').config();
const userRouter = require('./routers/userRouter');
const blogRouter = require('./routers/blogRouter');
const compRouter = require('./routers/compRouter');
const participationRouter = require('./routers/participationRouter');
const utilRouter = require('./routers/utilRouter');
const cors = require('cors');

const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

// Enhanced CORS configuration to handle both with and without trailing slash
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests, etc)
    if(!origin) return callback(null, true);
    
    // Create array with both versions of the origin (with and without trailing slash)
    const allowedOrigins = [
      CORS_ORIGIN,
      CORS_ORIGIN.endsWith('/') ? CORS_ORIGIN.slice(0, -1) : CORS_ORIGIN + '/'
    ];
    
    if(allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(new Error(`CORS policy violation: ${origin} not allowed`), false);
    }
  },
  credentials: true // Add this if you need to support cookies or authentication
}));

app.use(express.json());

app.use('/user', userRouter);
app.use('/blog', blogRouter);
app.use('/comp', compRouter);
app.use('/part', participationRouter);
app.use('/util', utilRouter);

app.get('/', (req, res) => {
    res.send('response from express');
});

app.get('/add', (req, res) => {
    res.send('response from add');
});

// Add an error handler for CORS errors
app.use((err, req, res, next) => {
  if (err.message.includes('CORS policy violation')) {
    console.error(err.message);
    return res.status(403).json({
      error: 'CORS error',
      message: 'Cross-Origin Request Blocked',
      details: err.message
    });
  }
  next(err);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`CORS configured for origin: ${CORS_ORIGIN}`);
});