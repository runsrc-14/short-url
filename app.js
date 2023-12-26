// app.js
import express ,{ json } from 'express';
import routes from './routes.js';
import dotenv from "dotenv";

const app = express();
dotenv.config();
app.use(json());

app.use('/', routes);
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});
