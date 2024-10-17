import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { adminAuth, getUser } from "../utils";

export const protectedRoute = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        let token = req.headers.authorization;
        if (!token) {
            return next(new createHttpError.Unauthorized());
        }
        token = token.split(" ").at(1) as string;
        const resp = await adminAuth.verifyIdToken(token);
        const uid = resp.uid;
        res.locals.user = await getUser(uid);
        return next();
    } catch (e: any) {
        if ("message" in e) {
            return next(new createHttpError.Unauthorized(e.message));
        }
        return next(e);
    }
};
