import express from "express";
import cors from "cors";
import routes from "./routes";

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  optionSuccessStatus: 200,
};

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(routes);
app.listen(5001, () => console.log("Server Started!"));
