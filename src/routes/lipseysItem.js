const express = require('express')
const lipseysItemController = require ('../controllers/catalogFeedLipseys')

const router = express.Router();

router.post('/lipseysCatalog', lipseysItemController.lipseysCatalog)
router.post('/getFilterKeys', lipseysItemController.getFilterKeys)
router.post('/getCatalog', lipseysItemController.getCatalogs)
router.get('/getManufacturers', lipseysItemController.getManufacturers)
router.get('/getFamilies', lipseysItemController.getFamily)
router.get('/getModels', lipseysItemController.getModels)
module.exports = router