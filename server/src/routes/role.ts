import express from "express";
import { adminDb } from "../utils";

export const roleRouter = express.Router();

roleRouter.get("/", async (req, res, next) => {
    try {
        const resp = (await adminDb.collection("roles").get()).docs.map(
            (doc) => {
                return { ...doc.data(), uid: doc.id };
            }
        );
        return res.status(200).json(resp);
    } catch (e) {
        next(e);
    }
});
