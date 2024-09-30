require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();

const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// connect to db
const connectDB = require('./db/connect');
const authRouter = require('./routes/auth');
const studentRouter = require('./routes/studentRoutes');
const adminRouter = require('./routes/adminRoutes');

const morgan = require('morgan');

//middlewares
app.use(express.json());
app.use(morgan('tiny'));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/student', studentRouter);
app.use('/api/v1/admin', adminRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}!!!`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
