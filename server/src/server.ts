require("dotenv").config();
import express from "express";
import morgan from "morgan";
import { AppDataSource } from "./data-source";
import authRouter from "./routes/auth";
import cors from "cors";
import subsRouter from "./routes/subs";
import cookieParser from "cookie-parser";
import postsRouter from "./routes/posts";
import votesRouter from "./routes/votes";
import usersRouter from "./routes/users";

const app = express();
const origin = process.env.ORIGIN;

// 백/프 간 도메인이 달라도 쿠키에 토큰을 발급할 수 있게 해줌.
app.use(cors({ origin, credentials: true }));
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

app.get("/", (req, res) => res.send("running"));
app.use("/api/auth", authRouter);
app.use("/api/subs", subsRouter);
app.use("/api/posts", postsRouter);
app.use("/api/votes", votesRouter);
app.use("/api/users", usersRouter);

app.use(express.static("public"));

const PORT = process.env.PORT;

app.listen(PORT, async () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
AppDataSource.initialize()
  .then(async () => console.log("Database initialized!!"))
  .catch((error) => console.log(error));
