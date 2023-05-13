const express = require("express");
const path = require("path");
const multer = require("multer");
const port = 10641;
const downloadFolder = path.join(__dirname, "/download");
const fs = require("fs");

const app = express();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '/upload') );
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    }
  });
  
  const uploadFolder = multer({ storage: storage });
//const uploadFolder = multer({dest:"upload/"});

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static('public'));
app.use("/download", express.static(path.join(__dirname, "download")));

app.get("/", (req,res)=>{
    res.set("Content-Type","text/html");
    res.sendFile( path.join(__dirname, '/index.html'));
});

app.listen(port,()=>{
    console.log(`Test ${port}`);
});

app.post("/upload", uploadFolder.single("files"), function(req,res){
    console.log(req.files);

    res.redirect("/");
});

app.get("/files", (req,res)=>{
  let fileCollection;
  fs.readdir(downloadFolder, (err,files)=>{
    if(err){
      console.error("Error when reading foled", err );
      res.status(500).json({error: "Error reading folder"});
    }

    res.json({files});
  });
});

app.get("/download/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "download", filename);

  res.download(filePath, (err) => {
    if (err) {
      console.error("Erreur lors du téléchargement du fichier :", err);
      res.status(404).send("Fichier non trouvé");
    }
  });
});