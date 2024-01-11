const { default: axios } = require("axios");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
// Define routes
app.get("/", (req, res) => {
  res.send("Hello, World!");
});
// Route 2: About
app.get("/about", (req, res) => {
  res.send("This is the about page.");
});

// Route 3: Contact
app.get("/contact", (req, res) => {
  res.send("Contact us at contact@example.com.");
});

app.get("/items", async (req, res) => {
  try {
    const response = await axios.post(
      "https://test.rsrgroup.com/api/rsrbridge/1.0/pos/get-items",
      {
        Username: 99901,
        Password: "webuser1",
        POS: "I",
        SortBy: "available-quantity",
      }
    );
    console.log("response =>",response);
    return res.status(200).send({
      error: false,
      message: "Got All Items",
      data:response.data  
    });
  } catch (error) {
    return res.status(500).send({
      error: error,
      message: "Error getting Items",
    });
  }
});
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
module.exports = app;
