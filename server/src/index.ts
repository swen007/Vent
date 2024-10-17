import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import createError, { HttpError } from "http-errors";
import morgan from "morgan";
import {
    roleRouter,
    userRouter,
    eventRouter,
    taskRouter,
    commentRouter,
} from "./routes";
import { fetchRoles } from "./utils";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(morgan("dev"));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// User Routes
app.use("/role", roleRouter);
app.use("/user", userRouter);
app.use("/task", taskRouter);
app.use("/event", eventRouter);
app.use("/comment", commentRouter);

// 404 not found.
app.use((req, _res, next) => {
    const err = new createError.NotFound(
        `The requested endpoint ${req.method} ${req.url} was not found.`
    );
    return next(err);
});

// Error Handling
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof HttpError) {
        return res.status(err.statusCode).json({ message: err.message });
    }
    return res.status(500).json({ err });
});

app.listen(PORT, async () => {
    console.log(`Listening on the url *:${PORT}`);
    await fetchRoles();
});
