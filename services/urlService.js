// services/urlService.js

import db from "../firebase/config.js";
import { nanoid } from "nanoid";

export async function retrieveUrlFromDatabase(shortId) {
  return new Promise((resolve, reject) => {
    const urlData = db.collection("short-link").doc(shortId);
    urlData
      .get()
      .then((doc) => {
        if (doc.exists) {
          const data = doc.data();
          resolve(data);
        } else {
          reject(new Error("URL not found"));
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function handleSuccessfulRedirect(res, originalUrl, metaImg, metaTitle) {
  res.send(`
    <html>
      <head>
        <meta property="og:url" content="${originalUrl}" />
        <meta property="og:title" content="${
          metaTitle || "Your Default Title"
        }" />
        <meta property="og:image" content="${metaImg || "Default Image URL"}" />
        <!-- Other meta tags -->
      </head>
      <body>
        <center>Redirecting to Friday</center>
        <script>
          window.location.href = "${originalUrl}";
        </script>
      </body>
    </html>
        `);
}

export function handleError(error, res) {
  if (error.message === "URL not found") {
    res.status(404).send("URL not found");
  } else {
    res.status(500).send("Internal Server Error");
  }
}

// Function to generate a unique short ID using nanoid
async function generateUniqueShortId() {
  let shortId = nanoid(8); // Adjust the length of the short ID as needed
  const urlDoc = db.collection("short-link").doc(shortId);
  const doc = await urlDoc.get();
  // Ensure the generated short ID is unique in Firestore
  while (doc.exists) {
    shortId = nanoid(8); // Generate a new short ID
    doc = await urlDoc.get(); // Check if the new ID exists
    console.log("doc: ", doc);
  }

  return shortId;
}
// Function to save the original URL with the generated short ID in Firestore
export async function generateShortUrl(originalUrl, metaImg, metaTitle) {
  const shortId = await generateUniqueShortId();

  const urlCollection = db.collection("short-link");
  await urlCollection.doc(shortId).set({
    originalUrl,
    metaImg,
    metaTitle,
  });
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? `https://friday-share-fb955bc29bef.herokuapp.com/`
      : `http://localhost:3000/`;

  return `${baseUrl}${shortId}`;
}
