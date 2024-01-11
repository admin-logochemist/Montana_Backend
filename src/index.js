const { default: axios } = require('axios');
const express = require('express');
const app = express();
const path = require('path')
const PORT = process.env.PORT || 3000;
const ftp = require("basic-ftp") 

app.use(express.json());
// Define routes
app.get("/", (req, res) => {
  res.send("Hello, World!");
});
// Route 2: About
app.get("/about", (req, res) => {
  res.send("This is the about page.");
})
app.get('/check',async (req, res) => {
  const client = new ftp.Client()
  client.ftp.verbose = true

      await client.access({
          host: "ftps.rsrgroup.com",
          user: "62156",
          password: "KU3MTcd9",
          port:2222,
          secure: true
      })
      console.log("=====>",await client.list())
      const response = await client.downloadToDir("upload/images", "/ftp_images/")
      ;

  res.send('Hello, World!');
});
// Route 2: About 
app.get('/api/items', async(req, res) => {
  let response; 
   const payload = {
    Username: 99901,
    Password: "webuser1",
    POS: "I",
    // Departments: id
    Limit: 1,
    // Offset: (currentPage - 1) * itemsPerPage
  };
  const apiEndpoint="https://test.rsrgroup.com/api/rsrbridge/1.0/pos/get-items"

await  axios.post(apiEndpoint,payload, {
  headers: { 'Content-Type': 'application/json' },
  })
    .then(res => {
      // Handle the response data
      response=res.data.Items
      console.log('API Response:', res,"====>",res.data.TotalFound);
    })
    .catch(error => {
      // Handle errors
      console.error('Error:', error.message);
    });
    res.status(200).send({mydata:response})
});

// Route 3: Contact
app.get('/contact', (req, res) => {
  res.send('Contact us at contact@example.com.');
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
module.exports = app
