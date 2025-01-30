import express from "express";

import cors from "cors";
import postRoutes from "./routes/posts.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import multer from "multer";


const app = express();

app.use(express.json());
app.use(cors());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../Blog-app-client/public/uploads')
    },
    filename: function (req, file, cb) {

      cb(null,Date.now()+file.originalname )
    }
  })

const upload = multer({ storage: storage })

app.post('/api/upload', upload.single('file'), function (req, res) {

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  console.log(req.file)
    const file  = req.file
  
    res.status(200).json(file.filename)

  })


app.use("/api/posts",postRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);



app.listen(process.env.PORT,() => {
console.log("connected to the ",process.env.PORT)
})