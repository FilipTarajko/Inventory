// GENERAL

var express = require('express');
var router = express.Router();

var category_controller = require('./controllers/category');
var item_controller = require('./controllers/item');

// CATEGORIES

// category create get
router.get('/create', category_controller.category_create_get);

// category create post
router.post('/create', category_controller.category_create_post);

// category delete get
router.get('/:id/delete', category_controller.category_delete_get);
 
// category delete post
router.post('/:id/delete', category_controller.category_delete_post);

// category update get
router.get('/:id/update', category_controller.category_update_get);

// category update post
router.post('/:id/update', category_controller.category_update_post);

// categories get
router.get('/',category_controller.categories_list);

// category get
router.get('/:id/', category_controller.category_detail);

// ITEMS

// item create get
router.get('/:category/create', item_controller.item_create_get);

// item create post
router.post('/:category/create', item_controller.item_create_post);

// item delete get
router.get('/:category/:id/delete', item_controller.item_delete_get);

// item delete post
router.post('/:category/:id/delete', item_controller.item_delete_post);

// item update get
router.get('/:category/:id/update', item_controller.item_update_get);

// item update post
router.post('/:category/:id/update', item_controller.item_update_post);

// item get
router.get('/:category/:id', item_controller.item_detail);

// EXPORT

module.exports = router;
