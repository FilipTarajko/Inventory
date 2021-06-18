var Category = require('../models/category');
var async = require('async');
const Item = require('../models/item');
const {body, validationResult} = require('express-validator');

// Display categories
exports.categories_list = function(req,res,next){
    Category.find()
    .exec(function (err, list_categories){
        if(err){return next(err);}
        res.render('categories_list', {title: 'Categories', categories_list: list_categories});
    });
};

// Display category
exports.category_detail = function(req,res,next){
    async.parallel({
        category: function(callback){
            Category.findById(req.params.id)
            .exec(callback)
        },
        items: function(callback){
            Item.find({'category':req.params.id})
            .exec(callback)
        },
    }, function (err, results) {
        if(err) {return next(err);}
        if(results.category==null){
            var err = new Error('Category not found!');
            err.status =404;
            return next(err);
        }
        res.render('category_detail', {title: results.category.name, items_list: results.items, category: results.category})
    });
    
};

// Category create GET
exports.category_create_get = function(req,res,next){
    res.render('category_form', {title: 'Create category'});
}
// Category create POST
exports.category_create_post = [
    body('name', 'Name must be specified and at least 3 characters long').trim().isLength({min:3}).escape(),
    body('description', 'Description must be specified').trim().isLength({min:1}).escape(),
    (req,res,next)=>{
        const errors=validationResult(req);
        var category = new Category(
            {
                name: req.body.name,
                description: req.body.description
            }
        );
        if(!errors.isEmpty()){
            res.render('category_form', {title: 'Create item', errors: errors.array()});
        }
        else{
            category.save(function(err){
                if(err) {return next(err);}
                res.redirect(category.url);
            });
        }
    }
]

// Category delete GET
exports.category_delete_get = function(req,res,next){
    async.parallel({
        category: function(callback){
            Category.findById(req.params.id).exec(callback)
        },
        items: function(callback){
            Item.find({'category': req.params.id}).exec(callback)
        },
    }, function(err, results){
        if(err){return next(err);}
        if(results.category==null){
            res.redirect('/');
        }
        res.render('category_delete', {title: 'Delete category', category: results.category, items: results.items});
    });
}
// Category delete POST
exports.category_delete_post = function(req,res,next){
    async.parallel({
        category: function(callback){
            Category.findById(req.body.id).exec(callback)
        },
        items: function(callback) {
            Item.find({'category':req.body.id}).exec(callback)
        },
    }, function(err, results){
        if(err) {return next(err);}
        if (results.items.length){
            res.render('category_delete', {title:'Delete category', category: results.category, items: results.items})
        }
        else {
            console.log('found 0 items!')
            Category.findByIdAndRemove(req.body.id, function deleteCategory(err){
                if(err){return next(err);}
                res.redirect('/')
            })
        }
    });
}

// Category update GET
exports.category_update_get = function(req,res,next){
    Category.findById(req.params.id, function(err, category){
        if(err){return next(err);}
        if(category==null){
            var err = new Error('Category not found');
            err.status = 404;
            return next(err);
        }
        res.render('category_form', {title:'Update category', category: category});
    });
};

// Category update POST
exports.category_update_post = [
    body('name', 'Name must be specified and at least 3 characters long').trim().isLength({min:3}).escape(),
    body('description', 'Description must be specified').trim().isLength({min:1}).escape(),
    (req,res,next)=>{
        const errors = validationResult(req);
        var category = new Category(
            {
                name: req.body.name,
                description: req.body.description,
                _id: req.params.id
            }
        );
        if(!errors.isEmpty)
        {
            res.render('category_form', {title:'Update category', category: category, errors: errors.array()});
            return;
        }
        else{
            Category.findByIdAndUpdate(req.params.id, category, {}, function (err, thecategory){
                if(err) {return next(err);}
                res.redirect(thecategory.url);
            });
        }
    }
]