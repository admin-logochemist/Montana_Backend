const express =require("express");
const router = express.Router();

const userRoutes = require('./auth');
const contactRoutes = require('./contact');
const lipseysCatalogRoutes = require("./lipseysItem")

const routes = [
    {path: "/auth", route: userRoutes},
    {path: "/contactus", route: contactRoutes},
    {path: "/lipseys", route: lipseysCatalogRoutes}
]

routes.forEach((route)=>{
    router.use(route.path, route.route)
})

module.exports = router;