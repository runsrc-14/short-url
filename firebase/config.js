import admin from "firebase-admin";
import serviceAccount from "./short-url-b901c-firebase-adminsdk-xmrz0-4628dafa1d.js";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });
export default db;