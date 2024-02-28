const mongoose = require ('mongoose');
const caliberGaugeSchema = mongoose.Schema(
    {
        caliberGauge: String
    },
    {
        timestamps: true
    }
) 

const caliberGaugeCategory = mongoose.model("caliberGaugeLipseys", caliberGaugeSchema);
module.exports = caliberGaugeCategory;