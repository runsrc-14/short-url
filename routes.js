// routes.js
import express from "express";
import * as urlService from "./services/urlService.js";

const router = express.Router();
// make short url
router.post("/shorten", async (req, res) => {
  const { originalUrl, metaImg, metaTitle } = req.body;

  try {
    const shortUrl = await urlService.generateShortUrl(originalUrl, metaImg, metaTitle);
    res.json({ originalUrl, shortUrl });
  } catch (error) {
    urlService.handleError(error, res);
  }
});
// get short url
router.get("/:shortId", async (req, res, next) => {
  try {
    const { shortId } = req.params;
    const { originalUrl, metaImg, metaTitle } =
      await urlService.retrieveUrlFromDatabase(shortId);

    if (originalUrl) {
      urlService.handleSuccessfulRedirect(res, originalUrl, metaImg, metaTitle);
    } else {
      res.status(404).send("URL not found");
    }
  } catch (error) {
    urlService.handleError(error, res);
  }
});

export default router;
