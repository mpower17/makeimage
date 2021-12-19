import express from "express";
import sharp from "sharp";
import imageSize from "image-size";
import multer from "multer";
import nodersa from "node-rsa";
import bodyParser from "body-parser";
import fs from "fs";

const img = multer({dest: "./img"});

const storage = multer.diskStorage({
  destination: './upload',
  filename: function (req, file, cb) {
    cb(null, file.fieldname);
  },
});

const upload = multer({ storage: storage });

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST',
  'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Accept, Authorization'
};
const app = express();

app.use(express.static('./uploads'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

function login(req, res) {
    res.set(CORS);
    res.send("mpower17");
}

app.all('/login/', login)

app.get("/makeimage", (r) => {
  const width = parseInt(r.query.width);
  const height = parseInt(r.query.height);
  sharp("./img/cat.jpeg")
    .resize(width, height)
    .toFile("./img/output.jpeg", (err, info) => {
      r.res.download("./img/output.jpeg");
    });
});

app.post("/size2json", img.single("image"), async (req, res) => {
  const path = req.file.path;
  imageSize(path, function (err, dimensions) {
      res.send(
          {
              width: dimensions.width,
              height: dimensions.height
          });
  });
});

app.post( "/decypher/", upload.fields([{name: "secret", maxCount: 1 }, {name: "key", maxCount: 1}]), (req, res, next) => {
  const files = req.files;

  if (!files) {
    const error = new Error("Please choose files");
    error.httpStatusCode = 400;
    return next(error);
  }

  const privateKey = fs.readFileSync("./upload/key", "utf8");
  const decrypted = new nodersa(privateKey).decrypt(fs.readFileSync("./upload/secret"),"utf8");

  res.send(decrypted);
});

app.all('*', login)


app.listen(process.env.PORT);