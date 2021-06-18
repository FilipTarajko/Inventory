var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ItemSchema = new Schema(
    {
        name: {type: String, required: true, minLength: 3, maxLength: 40},
        description: {type: String, required: true},
        category: {type: Schema.Types.ObjectId, ref: 'Category', required: true},
        price: {type: Number, required: true},
        stock: {type: Number, required: true}
    }
)

ItemSchema
.virtual('url')
.get(function(){
    return "/"+this.category._id+'/'+this._id;
});

ItemSchema
.virtual('parenturl')
.get(function(){
    return "/"+this.category_id;
})

module.exports = mongoose.model('Item',ItemSchema);