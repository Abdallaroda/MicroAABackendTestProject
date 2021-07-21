const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const errorHandler = require('./middleware/error-handler');

//third-party middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

//routes
app.use('/users', require('./controller/routes'));

//error-handler
app.use(errorHandler);

const port = process.env.NODE_ENV === 'production' ? (process.env.NODE_PORT || 80) : 3000;
app.listen(port, () => console.log(`Server listening to port: ${port}`));