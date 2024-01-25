require('dotenv').config();
require('express-async-errors');

// security packages
const helmet = require('helmet') //protects headers from hackers
const cors = require('cors') //helps to connects with different domain
const xss = require('xss-clean') // cleans user request so protects in case of malicious data entered by hackers
const rateLimiter = require('express-rate-limit') //limits no of request a user can make

const express = require('express');
const app = express();

const connectDB = require('./db/connect')
const authenticateUser = require('./middleware/authentication')
// routes imported
const authRouter = require('./routes/auth')
const jobsRouter = require('./routes/jobs')
// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');


app.use(rateLimiter({
  windowMs: 15*60*1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
}))
app.use(express.json());
app.use(helmet())
app.use(cors())
app.use(xss())




app.use('/api/auth',authRouter)
app.use('/api/jobs',authenticateUser,jobsRouter)


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
