const mongoose = require ('mongoose');
const manufacturerSchema = mongoose.Schema(
    {
        manufacturer: String
    },
    {
        timestamps: true
    }
) 

const ManufacturerCategory = mongoose.model("ManufacturerCategoryLipseys", manufacturerSchema);
module.exports = ManufacturerCategory;