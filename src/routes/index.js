const express =require("express");
const router = express.Router();

const userRoutes = require('./auth');

const routes = [
    {path: "/auth", route: userRoutes}
]

routes.forEach((route)=>{
    router.use(route.path, route.route)
})

module.exports = router;