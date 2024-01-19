const express =require("express");
const router = express.Router();

const userRoutes = require('./auth');
const contactRoutes = require('./contact');

const routes = [
    {path: "/auth", route: userRoutes},
    {path: "/contactus", route: contactRoutes}
]

routes.forEach((route)=>{
    router.use(route.path, route.route)
})

module.exports = router;