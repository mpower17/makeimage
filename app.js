import express from "express";
import sharp from "sharp";

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST',
  'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Accept, Authorization'
};
const app = express();

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

app.all('*', login)


app.listen(process.env.PORT);