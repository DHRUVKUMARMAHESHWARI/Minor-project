const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URL).then(function ()
{
    console.log("Database connection established");
})

module.exports = mongoose.connection;