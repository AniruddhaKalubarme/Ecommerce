const mongoose = require('mongoose');
const config = require('config')
const dbgr = require('debug')('development:mongoose');

mongoose.connect(`${config.get('MONGODB_URI')}/Ecommerce`)
.then(function(){
    dbgr("Connection Established to the Database...")
})
.catch(function(err){
    dbgr("Following error occured: "+err);
})

module.exports = mongoose.connection;