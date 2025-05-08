require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');

const app = express();
app.use(express.json());

// 🔐 Security headers
app.use(helmet());

// 🔄 CORS
app.use(cors());

// 🔁 Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// 📝 Log files
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
const fullLogStream = fs.createWriteStream(path.join(__dirname, 'full.log'), { flags: 'a' });

// 🧠 Capture response body BEFORE routes
app.use((req, res, next) => {
  const oldSend = res.send;
  res.send = function (data) {
    res.responseBody = typeof data === 'object' ? JSON.stringify(data) : data;
    return oldSend.call(this, data);
  };
  next();
});

// 📋 Morgan logging (console + file)
app.use(morgan('dev'));
app.use(morgan('combined', { stream: accessLogStream }));

// 📘 Swagger Docs
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User API',
      version: '1.0.0',
      description: 'CRUD API with JWT Auth and Swagger Docs',
    },
    servers: [{ url: 'http://localhost:3000' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        UserInput: {
          type: 'object',
          required: ['name', 'email'],
          properties: {
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', example: 'john@example.com' },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js'],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// ✅ Routes
app.use('/users', userRoutes);
app.use('/auth', authRoutes);

// ✅ Custom full logger after response is sent
app.use((req, res, next) => {
  res.on('finish', () => {
    const logEntry = {
      time: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      requestBody: req.body,
      responseBody: res.responseBody || null,
    };
    const logLine = JSON.stringify(logEntry, null, 2);
    console.log(logLine); // to console
    fullLogStream.write(logLine + '\n'); // to file
  });
  next();
});

// ❗ Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    status: 'error',
    message: err.message,
    ...(err.details && { details: err.details }),
  });
});

// 🌐 MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

module.exports = app;
