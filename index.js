const express = require('express');
const app = express();
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv/config');
const config = require('config');
const mongoose = require('mongoose');
const errorHandler = require('./middlewares/ErrorHandler');
require('express-async-errors');
const authRoutes = require('./routes/AuthRoute');
const productRoutes = require('./routes/ProductRoute');
const receiptRoutes = require('./routes/ReceiptRoute');
const userRoutes = require('./routes/UserRoute');
const adminRoutes = require('./routes/AdminRoute');
// const cartRoutes = require('./routes/CartRoute');
const roleRoutes = require('./routes/RoleRoute');
const categoryRoutes = require('./routes/CategoryRoute');
const receiptTypeRoutes = require('./routes/ReceiptTypeRoute');
const ioTypeRoutes = require('./routes/IOTypeRoute');
const companyRoutes = require('./routes/CompanyRoute');

//Check private key
if (!config.get('jwtPrivateKey')) {
  console.log('Private key is not defined');
  process.exit(1);
}

//Middlewares
//Helmet
app.use(helmet());

//Morgan
if (app.get('env') === 'development') {
  app.use(morgan('common'));
  console.log('Morgan loaded');
}

//Body parser
app.use(express.json());

//Error handler
app.use(errorHandler);

//Routes
//Auth
const api = process.env.API_URL;
console.log(api);
app.use(`${api}/auth`, authRoutes);
app.use(`${api}/product`, productRoutes);
app.use(`${api}/receipt`, receiptRoutes);
app.use(`${api}/user`, userRoutes);
app.use(`${api}/admin`, adminRoutes);
// app.use(`${api}/cart`, cartRoutes);
app.use(`${api}/role`, roleRoutes);
app.use(`${api}/category`, categoryRoutes);
app.use(`${api}/receipt-type`, receiptTypeRoutes);
app.use(`${api}/io-type`, ioTypeRoutes);
app.use(`${api}/company`, companyRoutes);

//Connect DB
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'ShoppingAPI',
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.log('Failed to connect MongoDB');
    console.log(err);
    process.exit(1);
  });

const port = process.env.port || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));
