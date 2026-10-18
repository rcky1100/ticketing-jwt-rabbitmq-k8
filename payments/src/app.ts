import express from "express";
import cors from "cors";
import { errorHandler, NotFoundError, currentUser } from "@rcky1983/common-rmq";
import { createChargeRouter } from "./routes/new";

const app = express();
app.set("trust proxy", true);
app.use(express.json());
app.use(cors());
app.use(currentUser);

app.use(createChargeRouter);

app.use((req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
