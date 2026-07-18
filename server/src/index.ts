import express from 'express'
import multer from 'multer'
import cors from 'cors'


const app = express()
app.use(cors())

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, `${uniqueSuffix}-${file.originalname}`)
  }
})
const upload = multer({ storage: storage })


app.post("/upload/pdf",upload.single('pdf'),async (req,res)=>{
    const file = req.query
    res.json("File uploaded")
})

app.listen(8000,()=>{
    console.log(`Server Running on Port:${8000}`)
})