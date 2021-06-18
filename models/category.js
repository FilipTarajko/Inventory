var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CategorySchema = new Schema(
    {
        name: {type: String, required: true, minLength: 3, maxLength: 40},
        description: {type: String, required: true}
    }
);

CategorySchema
.virtual('url')
.get(function(){
    return '/'+this._id;
});

module.exports = mongoose.model('Category',CategorySchema);