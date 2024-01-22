const express = require("express");
const contactController = require("../controllers/contact");

const router = express.Router();

router.post("/contact", contactController.contactUs);
router.get("/", async (req,res)=>{
  res.send("test");
})

module.exports = router;