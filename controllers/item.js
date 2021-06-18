var Item = require('../models/item');
var Category = require('../models/category');
var async = require('async');
const { body, validationResult } = require('express-validator');

// Display item
exports.item_detail = function(req,res,next){
    async.parallel({
        item: function(callback){
            Item.findById(req.params.id)
            .populate('category')
            .exec(callback)
        },
    }, function (err, results) {
        if(err) {return next(err);}
        if(results.item==null || results.category){
            var err = new Error('Item not found!');
            err.status = 404;
            return next(err);
        }
        res.render('item_detail', {title: results.item.name, item: results.item})
    });
};

// Item create GET
exports.item_create_get = function(req,res,next){
    Category.findById(req.params.category)
    .exec(function(err, category){
        if(err) {return next(err);}
        res.render('item_form', {title: 'Create item', category: category});
    });
};

// Item create POST
exports.item_create_post = [
    body('name', 'Name must be specified and at least 3 characters long').trim().isLength({min:3}).escape(),
    body('description', 'Description must be specified').trim().isLength({min:1}).escape(),
    body('price', 'Price must be specified').isNumeric(),
    body('stock', 'Stock must be specified').isNumeric(),
    (req,res,next)=>{
        const errors = validationResult(req);
        var item = new Item(
            {
                name: req.body.name,
                description: req.body.description,
                category: req.params.category,
                price: req.body.price,
                stock: req.body.stock
            });
        Category.findById(req.params.category)
        .exec(function(err, category){
            if (!errors.isEmpty()){
                res.render('item_form', {title: 'Create item', category: category, errors:errors.array()});
            }
            else {
                item.save(function(err) {
                    if(err) {return next(err);}
                    res.redirect(item.url);
                });
            }
        });
    }
]

// Item delete GET
exports.item_delete_get = function(req,res,next){
    Item.findById(req.params.id)
    .populate('category')
    .exec(function(err,item){
        if(err){return next(err);}
        res.render('item_delete', {title: 'Delete item', item: item})
    });
}
// Item delete POST
exports.item_delete_post = function(req,res,next){
    Item.findByIdAndRemove(req.body.id, function deleteItem(err){
        if(err){return next(err);}
        res.redirect('..');
    });
}
// Item update GET
exports.item_update_get = function(req,res,next){
    async.parallel({
        item: function(callback){
            Item.findById(req.params.id)
            .populate('category')
            .exec(callback);
        },
        category: function(callback){
            Category.find(callback);
        },
    }, function(err, results){
        if(err){return next(err);}
        if(results.item==null){
            var err = new Error('Item not found');
            err.status = 404;
            return next(err);
        }
        res.render('item_form',{title:'Update item', item: results.item, category: results.category});
    });
}

// Item update POST
exports.item_update_post = [
    body('name', 'Name must be specified and at least 3 characters long').trim().isLength({min:3}).escape(),
    body('description', 'Description must be specified').trim().isLength({min:1}).escape(),
    body('price', 'Price must be specified').isNumeric(),
    body('stock', 'Stock must be specified').isNumeric(),
    (req, res, next)=>{
        const errors=validationResult(req);
        var item = new Item(
            {
                name: req.body.name,
                description: req.body.description,
                category: req.params.category,
                price: req.body.price,
                stock: req.body.stock,
                _id: req.params.id
            });
        if(!errors.isEmpty()){
            res.render('item_form', {title:'Update item', item: item, category: category, errors: errors.array()});
            return;
        }
        else{
            Item.findByIdAndUpdate(req.params.id, item, {}, function(err, theitem){
                if(err){return next(err);}
                res.redirect(theitem.url);
            });
        }
    }
]