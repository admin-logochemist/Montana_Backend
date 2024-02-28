const mongoose = require ('mongoose');
const itemGroupSchema = mongoose.Schema(
    {
        itemGroup: String
    },
    {
        timestamps: true
    }
) 

const itemGroupCategory = mongoose.model("itemGroupCategoryLipseys", itemGroupSchema);
module.exports = itemGroupCategory;