const db = require("../models");
const lipseysApi = require("lipseys-api");

// delete existing items from DB and Add new
const lipseysCatalog = async (req, res) => {
    const email = process.env.LIPSEYS_CLIENT_EMAIL;
    const password = process.env.LIPSEYS_CLIENT_PASSWORD;
    console.log(email, password)
    let data = []
    try {
        //Catalog Feed

        await lipseysApi.Init(email, password, function (resp) {
            console.log(resp);
            // res.status(200).json({ success: true, message: "token generated", data: resp });
        })

        await lipseysApi.Inventory.CatalogFeed(async function (resp) {

            await db.CatalogFeedModel.deleteMany({}); // Delete existing data

            await db.CatalogFeedModel.insertMany(resp.data);

            res.status(200).json({ success: true, message: "dataSaveinDAtabase", data: resp })
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, error: "Internal server error" })
    }
}
// filter keys and save in database;
const getFilterKeys = async (req, res) => {
    // manufacturer , itemType, itemGroup
    const { key } = req.body;
    console.log("key-->", key)
    try {
        if (!key) res.status(400).json({ success: true, message: "key not found" })
        const items = await db.CatalogFeedModel.find();
        console.log("data lenght--> ", items.length)

        let uniqueItemTypes = new Set();
        let itemTypes = items.reduce((result, obj) => {
            const combination = obj[key];
            if (!uniqueItemTypes.has(combination)) {
                uniqueItemTypes.add(combination);
                result.push({ [key]: obj[key] })
            }
            return result;
        }, [])

        switch (key) {
            case "itemType":
                await db.ItemTypesCategory.deleteMany({});
                await db.ItemTypesCategory.insertMany(itemTypes);
                break;
            case "manufacturer":
                await db.ManufacturerCategory.deleteMany({});
                await db.ManufacturerCategory.insertMany(itemTypes);
                break;
            case "itemGroup":
                await db.ItemGroupCategoryModel.deleteMany({});
                await db.ItemGroupCategoryModel.insertMany(itemTypes);
                break;
            case "caliberGauge":
                await db.CaliberGaugeCategoryModel.deleteMany({});
                await db.CaliberGaugeCategoryModel.insertMany(itemTypes);
                break;
            default:
                res.status(400).json({ success: true, message: "key not matched" })
                break;
        }

        console.log("filterd Data", itemTypes)

        res.status(200).json({ success: true, data: { itemTypes, uniqueItemTypes }, message: `${key}s are filtered successfully` })

    } catch (error) {
        res.status(500).json({ success: false, message: error.message, error: "Internal server error" })
    }
}

// http://localhost:3000/products?page=1&limit=20
const getCatalogs = async (req, res) => {

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const type = req.query.type;
  const value = req.query.value;

  const query = {};

  // Add category filter if provided
  if (type) {
    query[type] = value;
  }

  try {
    // Count total number of products matching the query
    const totalCount = await db.CatalogFeedModel.countDocuments(query);

    // Fetch products for the specified page and limit
    const products = await db.CatalogFeedModel.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      type,value,
      currentCount: products.length,
      products
    });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
// return array of unique menufacturers
const getManufacturers = async (req,res)=>{
    try {
        const manufacturers = await db.CatalogFeedModel.distinct('manufacturer');
        res.status(200).json({success:true, message:"Menufacturer fetch successful", data:manufacturers});

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
// return array of unique families of particular menufacturer
const getFamily = async (req,res)=>{
    console.log("req-query-> ",req.query)
    try {
        const families = await db.CatalogFeedModel.distinct('family', req.query);
        res.status(200).json({success:true, message:"Families fetch successful", data:families});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
// return array of unique models of particular family
const getModels = async (req,res)=>{
    console.log("req-query-> ",req.query)
    try {
        const models = await db.CatalogFeedModel.distinct('model', req.query);
        res.status(200).json({success:true, message:"Models fetch successful", data:models});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


module.exports = {
    lipseysCatalog, getFilterKeys, getCatalogs, getManufacturers, getFamily,getModels
}