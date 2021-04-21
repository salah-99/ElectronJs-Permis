const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.DATABASE, { useUnifiedTopology: true,  useNewUrlParser: true, useCreateIndex: true});
mongoose.connection
        .once('open', ()=>console.log('Connected'))
        .on('error', (err)=>{
          console.log(`could not connect`, err);
        });

module.exports = mongoose;