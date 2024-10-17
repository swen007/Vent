import express from "express";
import { protectedRoute, validate } from "../middleware";
import { fetchEventSchema } from "../schemas";
import { User, ValidationSchema } from "../types";
import { adminDb } from "../utils";

export const commentRouter = express.Router();

commentRouter.get(
    "/",
    protectedRoute,
    validate(fetchEventSchema as unknown as ValidationSchema),
    async (req, res, next) => {
        try {
            const uid = req.query.uid as string;
            const resp = await adminDb
                .collection("tasks")
                .doc(uid)
                .collection("comments")
                .orderBy("createdBy")
                .get();
            return res.status(200).json(resp.docs.map((doc) => doc.data()));
        } catch (e) {
            next(e);
        }
    }
);

commentRouter.post(
    "/",
    protectedRoute,
    validate(fetchEventSchema as unknown as ValidationSchema),
    validate(fetchEventSchema as unknown as ValidationSchema),
    async (req, res, next) => {
        try {
            const uid = req.query.uid as string;
            const currentUser = res.locals.user as User;
            const comment = req.body.comment as string;
            await adminDb
                .collection("tasks")
                .doc(uid)
                .collection("comments")
                .doc()
                .set({
                    userId: currentUser.uid,
                    comment,
                    createdAt: new Date(),
                });
            return res.status(200).json({
                userId: currentUser.uid,
                comment,
                createdAt: new Date(),
            });
        } catch (e) {
            next(e);
        }
    }
);
