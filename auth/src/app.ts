import express from "express";
import cors from "cors";
import { errorHandler, NotFoundError } from "@rcky1983/common-rmq";
import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signupRouter } from "./routes/signup";

const app = express();
app.set("trust proxy", 1); // trust first proxy
app.use(express.json());
app.use(cors());
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signupRouter);

app.use((req, res) => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
