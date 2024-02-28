const { default: axios } = require("axios");
const express = require("express");
const app = express();
const path = require("path");
const db = require("./db")
const PORT = process.env.PORT || 3000;
const ftp = require("basic-ftp");
const cors = require("cors");
const router = require("./routes");
const dbModel = require("./models")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const authController = require('./controllers/auth');


app.use(express.json());
app.use(cors());



let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "developer@seniorresidencemap.com",
    pass: "xtap wkcy bihr zmqx",
  },
});
// send mail api
// app.post("/sendMail", async (req, res) => {
//   try {
//     let { name, email } = req.body;
//     let info = await transporter.sendMail({
//       from: "muhammadumar10293847@gmail.com",
//       to: email,
//       subject: "Senior Residence Registration",
//       html: `  <table cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
//       <tr>
//           <td bgcolor="#4B266A" style="padding: 20px; text-align: center;">
//               <img with="120" src="https://firebasestorage.googleapis.com/v0/b/landingpages-d5920.appspot.com/o/images%2Flogo.png?alt=media&token=9a446a17-8fb2-462e-87c2-1ea875eda322" alt="Your Brand Logo" style="max-width: 150px; height: auto;">
//               <h2 style="color: #ffffff;">User Registration Confirmation</h2>
//               <p style="color: #ffffff;">Thank you for registering! Your account has been successfully created.</p>
//           </td>
//       </tr>
//       <tr>
//           <td bgcolor="#ffffff" style="padding: 20px;">
//               <table cellpadding="10" cellspacing="0" width="100%" style="border-collapse: collapse; border: 1px solid #dddddd;">
//                   <tr>
//                       <td><strong style="color: #4B266A;">Name:</strong></td>
//                       <td>${name}</td>
//                   </tr>
//                   <tr>
//                       <td><strong style="color: #4B266A;">Email:</strong></td>
//                       <td>${email}</td>
//                   </tr>
//                   <!-- Add more user details as needed -->
//               </table>
//           </td>
//       </tr>
//       <tr>
//           <td bgcolor="#4B266A" style="padding: 20px; text-align: center;">
//               <p style="color: #ffffff;">Thank you for choosing our platform!</p>
//           </td>
//       </tr>
//   </table>`,
//     });

//     res.status(200).json({ info });
//   } catch (error) {
//     return res.status(500).send({
//       error: error,
//       message: "Error while sending mail",
//     });
//   }
// })
// send mail api
// app.post("/sendInvite", async (req, res) => {
//   try {
//     let { name, email } = req.body;
//     let info = await transporter.sendMail({
//       from: "muhammadumar10293847@gmail.com",
//       to: email,
//       subject: "Senior Residence Registration",
//       html: `<table cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
//       <tr>
//           <td bgcolor="#4B266A" style="padding: 20px; text-align: center; color: #ffffff;">
//               <!-- Include your app logo here -->
//               <img src="https://firebasestorage.googleapis.com/v0/b/landingpages-d5920.appspot.com/o/images%2Flogo.png?alt=media&token=9a446a17-8fb2-462e-87c2-1ea875eda322" alt="Your App Logo" width="100" height="auto" style="display: block; margin: 0 auto;">
//               <h2>You're Invited to Join Senior Residence Map</h2>
//               <p>Join Senior Residence Map and experience a new level of features/benefits!</p>
//           </td>
//       </tr>
//       <tr>
//           <td bgcolor="#ffffff" style="padding: 20px;">
//               <p>You've been invited by <b>${name}</b> to join <b>Senior Residence Map</b> App. To get started, follow these simple steps:</p>
//               <ul>
//                   <li>Download the app from the App Store or Google Play Store.</li>
//                   <li>Sign up with your email address and create a secure password.</li>
//                   <!-- Add any additional steps or information as needed -->
//               </ul>
//           </td>
//       </tr>
//       <tr>
//           <td bgcolor="#4B266A" style="padding: 20px; text-align: center; color: #ffffff;">
//               <p>Ready to join the community?</p>
//               <a href="#" style="color: #ffffff; text-decoration: none; font-weight: bold;">Download the App</a>
//           </td>
//       </tr>
//   </table>`,
//     });
//     res.status(200).json({ info });
//   } catch (error) {
//     return res.status(500).send({
//       error: error,
//       message: "Error while sending Invite",
//     });
//   }
// })

// Define routes
app.get("/", (req, res) => {
  res.send(`Hello Updated Again, World!last deployed on ${new Date().toLocaleDateString()}`);
});
// Route 2: About
app.get("/about", (req, res) => {
  res.send("This is the about page.");
});
app.get("/check", async (req, res) => {
  const client = new ftp.Client();
  client.ftp.verbose = true;

  await client.access({
    host: "ftps.rsrgroup.com",
    user: "62156",
    password: "KU3MTcd9",
    port: 2222,
    secure: true,
  });
  console.log("=====>", await client.list());
  const response = await client.downloadToDir("upload/images", "/ftp_images/");
  res.send("Hello, World!");
});
// Route 2: About
app.post("/api/items/:id", async (req, res) => {
  let response;
  const payload = {
    Username: 99901,
    Password: "webuser1",
    POS: "I",
    Limit: "2500",
    WithAttributes: true,
    Departments: req.params.id
    // Offset: (currentPage - 1) * itemsPerPage
  };
  if (req.body.limit) {
    payload.Limit = req.body.limit;
  }
  const apiEndpoint =
    "https://test.rsrgroup.com/api/rsrbridge/1.0/pos/get-items";

  await axios
    .post(apiEndpoint, payload, {
      headers: { "Content-Type": "application/json" },
    })
    .then((res) => {
      // Handle the response data
      response = res.data.Items;
      console.log("API Response:", res, "====>", res.data.TotalFound);
    })
    .catch((error) => {
      // Handle errors
      console.error("Error:", error.message);
      return res.status(500).send({
        error: error,
        message: "Error getting Items",
      });
    });
  res.status(200).send({ Length: response.length, mydata: response });
});
// Route 3: Contact
app.get("/contact", (req, res) => {
  res.send("Contact us at contact@example.com.");
});
// department wise items
app.get("/items/:id", async (req, res) => {
  try {
    // get items from test apis
    const response = await axios.post(
      "https://test.rsrgroup.com/api/rsrbridge/1.0/pos/get-items",
      {
        Username: 99901,
        Password: "webuser1",
        POS: "I",
        SortBy: "available-quantity",
        WithAttributes: true,
        Departments: req.params.id,
      }
    );
    console.log("response =>", response);
    return res.status(200).send({
      error: false,
      message: "Got All Items",
      data: response.data,
    });
  } catch (error) {
    return res.status(500).send({
      error: error,
      message: "Error getting Items",
    });
  }
});
// catalog
app.get("/api/item/:id", async (req, res) => {
  try {
    const response = await axios.post("https://test.rsrgroup.com/api/rsrbridge/1.0/pos/check-catalog",
      {
        Username: 99901,
        Password: "webuser1",
        POS: "I",
        UPCcode: req.params.id
      })
    console.log("response", response);
    return res.status(200).send({
      success: true,
      message: "Got All Items",
      data: response.data
    })

  } catch (error) {
    return res.status(500).send({
      error: error,
      message: "Error while geting categories."
    })
  }
})
// attrubutes
app.get("/api/item/attributes/:id", async (req, res) => {
  try {
    const response = await axios.post("https://test.rsrgroup.com/api/rsrbridge/1.0/pos/get-item-attributes",
      {
        Username: 99901,
        Password: "webuser1",
        POS: "I",
        UPCcode: req.params.id
      })
    // UPCcode: req.body.UPCcode
    console.log("response", response);
    return res.status(200).send({
      success: true,
      message: "Got All Item Attributes",
      data: response?.data?.Attributes
    })

  } catch (error) {
    return res.status(500).send({
      error: error,
      message: "Error while geting categories."
    })
  }
})


app.use("/api", router);

app.post("/api/signup", async (req, res) => {
  try {
    const {
      firstName, secondName, email, password
    } = req.body;
    // Check if the user already exists
    const existingUser = await dbModel.UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new dbModel.UserModel({ firstName, secondName, email, password: hashedPassword });
    await newUser.save();

    // Generate JWT token
    // const token = await jwt.sign({ userId: newUser._id }, process.env.SECRET_KEY, {
    //     expiresIn: '1h',
    // });
    const token = "asdadasd"
    console.log("secretkey-->", process.env.SECRET_KEY);
    return res.status(200).json({
      success: true,
      token,
      data: { firstName, secondName, email },
      message: 'User registered successfully'
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Error while registering the user"
    })
  }
});
app.get("/api/getusers", async (req, res) => {
  try {
    const users = await dbModel.UserModel.find();
    return res.status(200).json({
      data: users
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Error while registering the user"
    })
  }
})

// app.use('/api', routes)
// Start the server
db.ConnectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}).catch((error) => {
  console.log(error)
})
module.exports = app;
