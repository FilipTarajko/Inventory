#! /usr/bin/env node

console.log('This script populates db');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Item = require('./models/item')
var Category = require('./models/category')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var items = []
var categories = []

function itemCreate(name, description, category, price, stock, cb) {
  itemdetail = {
    name: name,
    description: description,
    price: price,
    stock: stock
  }
  if (category != false) itemdetail.category = category
    
  var item = new Item(itemdetail);    
  item.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New item: ' + item);
    items.push(item)
    cb(null, item)
  }  );
}

function categoryCreate(name, description, cb) {
  categorydetail = { 
    name: name,
    description: description
  }
  var category = new Category(categorydetail);    
  category.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New category: ' + category);
    categories.push(category)
    cb(null, category)
  }  );
}

function createCategories(cb) {
    async.parallel([
        function(callback) {
          categoryCreate('Food', 'All these things are eatable!', callback)
        },
        function(callback) {
          categoryCreate('Drinks', 'Are you thirsty?', callback)
        },
        function(callback) {
          categoryCreate('Stationery', 'You may need it!', callback)
        },
        function(callback) {
          categoryCreate('Electronics', 'Wanna get rid of some money quickly?', callback)
        }
        ],
        // Optional callback
        cb);
}

function createItems(cb) {
    async.parallel([
        function(callback) {
          itemCreate('Apple', 'An apple a day keeps the doctor away!', categories[0], 1, 100, callback);
        },
        function(callback) {
          itemCreate('Pear', 'Eat this before it dissapPEARs! Ha, ha... ha?', categories[0], 2, 50, callback);
        },
        function(callback) {
          itemCreate('Fish', "It's not swimming (anymore).", categories[0], 8, 10, callback)
        },
        function(callback) {
          itemCreate('Water', 'Drink this!', categories[1], 0.5, 100, callback);
        },
        function(callback) {
          itemCreate('Apple juice', 'Almost tastes similar to apples!', categories[1], 5, 5, callback);
        },
        function(callback) {
          itemCreate('Ream of paper', 'paper x 500!', categories[2], 15, 30, callback)
        },
        function(callback) {
          itemCreate('Pen', 'This is useful!', categories[2], 3, 80, callback)
        },
        function(callback) {
          itemCreate('Gaming PC', 'RTX3090! Ryzen Threadripper 3990X! 64GB 3200MHz Ram! 2TB NVMe SSD!', categories[3], 5000, 1, callback)
        },
        function(callback) {
          itemCreate('iPhone', 'Not very cheap.', categories[3], 3000, 4, callback)
        },
        function(callback) {
          itemCreate('Computer mouse', 'May be old.', categories[3], 8, 1, callback)
        }
        ],
        // optional callback
        cb);
}

async.series([
    createCategories,
    createItems
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('Success');
    }
    // All done, disconnect from database
    mongoose.connection.close();
});
