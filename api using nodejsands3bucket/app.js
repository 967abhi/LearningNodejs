// require("dotenv").config();

// const express = require("express");

// const app = express();
// const port = 3000;
// app.listen(port, () => {
//   console.log(`server is running on ${port}`);
// });

// const aws = require("aws-sdk");
// const multer = require("multer");
// const multerS3 = require("multer-s3");

// aws.config.update({
//   secretAccessKey: process.env.ACCESS_SECRET,
//   accessKeyId: process.env.ACCESS_KEY,
//   region: process.env.REGION,
// });
// const BUCKET = process.env.BUCKET;
// const s3 = new aws.S3();

// const upload = multer({
//   storage: multerS3({
//     s3: s3,
//     acl: "public-read",
//     bucket: BUCKET,
//     key: function (req, file, cb) {
//       console.log(file);
//       cb(null, file.originalname);
//     },
//   }),
// });

// app.post("/upload", upload.single("file"), async function (req, res, next) {
//   res.send("Successfully uploaded " + req.file.location + " location!");
// });

// app.get("/list", async (req, res) => {
//   let r = await s3.listObjectsV2({ Bucket: BUCKET }).promise();
//   let x = r.Contents.map((item) => item.Key);
//   res.send(x);
// });

// app.get("/download/:filename", async (req, res) => {
//   const filename = req.params.filename;
//   let x = await s3.getObject({ Bucket: BUCKET, Key: filename }).promise();
//   res.send(x.Body);
// });

// app.delete("/delete/:filename", async (req, res) => {
//   const filename = req.params.filename;
//   await s3.deleteObject({ Bucket: BUCKET, Key: filename }).promise();
//   res.send("File Deleted Successfully");
// });
// =======above working code =================
require("dotenv").config();

const express = require("express");
const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const cors = require("cors");

const app = express();
const port = 3000;
app.use(cors());
aws.config.update({
  secretAccessKey: process.env.ACCESS_SECRET,
  accessKeyId: process.env.ACCESS_KEY,
  region: process.env.REGION,
});

const BUCKET = process.env.BUCKET;
const s3 = new aws.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    acl: "public-read",
    bucket: BUCKET,
    key: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});

// Middleware for validating requests
const validateRequest = (req, res, next) => {
  // Implement validation logic here
  next();
};

app.use(express.json()); // Parse JSON request bodies
app.use(validateRequest); // Apply validation middleware

app.post("/upload", upload.single("file"), async (req, res) => {
  res.send("Successfully uploaded " + req.file.location + " location!");
});

// app.get("/list", async (req, res) => {
//   try {
//     const response = await s3.listObjectsV2({ Bucket: BUCKET }).promise();
//     const fileList = response.Contents.map((item) => item.Key);
//     res.json({ files: fileList });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal Server Error");
//   }
// });
app.get("/list", async (req, res) => {
  try {
    const response = await s3.listObjectsV2({ Bucket: BUCKET }).promise();
    const fileList = response.Contents.map((item) => {
      return {
        name: item.Key,
        viewLink: `/view/${encodeURIComponent(item.Key)}`, // Add this line
      };
    });
    res.json({ files: fileList });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
// =======
app.get("/view/:filename", async (req, res) => {
  const filename = req.params.filename;
  try {
    const response = await s3
      .getObject({ Bucket: BUCKET, Key: filename })
      .promise();

    // Determine the content type based on the file extension
    let contentType = "application/octet-stream"; // Default content type

    const fileExtension = filename.split(".").pop().toLowerCase();
    if (fileExtension === "pdf") {
      contentType = "application/pdf";
    } else if (fileExtension === "jpg" || fileExtension === "jpeg") {
      contentType = "image/jpeg";
    } else if (fileExtension === "png") {
      contentType = "image/png";
    } else if (fileExtension === "mp4") {
      contentType = "video/mp4";
    } else if (fileExtension === "xlsx") {
      contentType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    } else if (fileExtension === "docx") {
      contentType =
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    }

    res.setHeader("Content-Type", contentType);
    res.send(response.Body);
  } catch (error) {
    console.error(error);
    res.status(404).send("File Not Found");
  }
});
// =====================
app.get("/download", async (req, res) => {
  const filename = req.params.filename;
  try {
    const response = await s3
      .getObject({ Bucket: BUCKET, Key: filename })
      .promise();
    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
    res.send(response.Body);
  } catch (error) {
    console.error(error);
    res.status(404).send("File Not Found");
  }
});

app.delete("/delete/:filename", async (req, res) => {
  const filename = req.params.filename;
  try {
    await s3.deleteObject({ Bucket: BUCKET, Key: filename }).promise();
    res.send("File Deleted Successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
