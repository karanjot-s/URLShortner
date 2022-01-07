const express = require("express");
const mongoose = require("mongoose");
const ShortUrl = require("./models/shortUrls");
const app = express();

const PORT = process.env.PORT || 5000;

mongoose.connect(
  "mongodb://karanjot:karan24mongodb@urlshortner-shard-00-00.zijij.mongodb.net:27017,urlshortner-shard-00-01.zijij.mongodb.net:27017,urlshortner-shard-00-02.zijij.mongodb.net:27017/UrlShortner?ssl=true&replicaSet=atlas-z13bh5-shard-0&authSource=admin&retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render("index", { shortUrls: shortUrls });
});

app.post("/shorturls", async (req, res) => {
  await ShortUrl.create({ full: req.body.fullUrl });
  res.redirect("/");
});

app.get("/:shortUrl", async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });

  if (shortUrl == null) return res.sendStatus(404);

  shortUrl.clicks++;
  await shortUrl.save();

  res.redirect(shortUrl.full);
});

console.log(`Started at port ${PORT}`);

app.listen(PORT);
