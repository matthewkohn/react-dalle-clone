import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Configuration, OpenAIApi } from "openai";
import fs from 'fs';
import multer from 'multer';
// import { basename } from 'path';

const PORT = 8000;
const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.API_KEY,
});
const openai = new OpenAIApi(configuration);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public')
  },
  filename: (req, file, cb) => {
    console.log("file: ", file)
    cb(null, Date.now() + "-" + file.originalname)
  }
})
const upload = multer({ storage: storage }).single('file')
let filePath

app.post('/images', async (req, res) => {
  try {
    const response = await openai.createImage({
      prompt: req.body.message,
      n: 6,
      size: "1024x1024",
    });
    res.send(response.data.data);

  } catch (error) {
    console.error(error);
  }
})

app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
     filePath = req.file.path
  })
})

app.post('/variations', async (req, res) => {
  try {
    const response = await openai.createImageVariation(
      fs.createReadStream(filePath),
      6,
      "1024x1024"
    )
    res.send(response.data.data)
  } catch (error) {
    console.error(error)
  }
})



app.listen(PORT, () => console.log('Your server is running on PORT ' + PORT));

