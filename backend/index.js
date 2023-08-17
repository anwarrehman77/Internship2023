const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = 8080;

const connectionString = "mongodb+srv://anwarrehman77:sKHlvAIDmx2vMPfo@betterbreakfast.fpnwgkf.mongodb.net/Test";

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(bodyParser.json());
app.use('/', require('./routes/routes'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
