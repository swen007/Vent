import express from "express";
import { protectedRoute, validate } from "../middleware";
import {
    createTaskSchema,
    fetchEventSchema,
    updateTaskSchema,
} from "../schemas";
import {
    BaseTask,
    FetchedTask,
    FetchedUser,
    User,
    ValidationSchema,
} from "../types";
import { adminDb, getUser } from "../utils";

export const taskRouter = express.Router();

taskRouter.get("/", protectedRoute, async (req, res, next) => {
    try {
        const loggedInUser = res.locals.user as User;
        let resp: FetchedTask[] = (
            await adminDb
                .collection("tasks")
                // .where("userId", "==", currentUser.uid)
                .get()
        ).docs.map((doc) => doc.data() as FetchedTask);

        const promises = resp.map((task) => getUser(task.assignedTo));

        Promise.all(promises)
            .then((users) => {
                console.log(users);
                const usersRecord: Record<string, User> = {};
                users.forEach((user) => {
                    usersRecord[user.uid] = user;
                });
                resp = resp.filter((task) => {
                    return (
                        usersRecord[task.assignedTo].role.accessLevel <=
                        loggedInUser.role.accessLevel
                    );
                });
                return res.status(200).json(resp);
            })
            .catch((e) => {
                console.log("error: ");
                console.log(e);
                next(e);
            });
    } catch (e) {
        next(e);
    }
});

taskRouter.get("/incomplete", protectedRoute, async (req, res, next) => {
    try {
        const resp = (
            await adminDb.collection("tasks").where("done", "==", false).get()
        ).docs.map((doc) => doc.data());
        return res.status(200).json(resp);
    } catch (e) {
        next(e);
    }

    return res.status(200).json({ message: "working..." });
});

taskRouter.get("/complete", protectedRoute, async (req, res, next) => {
    try {
        const resp = (
            await adminDb.collection("tasks").where("done", "==", true).get()
        ).docs.map((doc) => doc.data());
        return res.status(200).json(resp);
    } catch (e) {
        next(e);
    }
    return res.status(200).json({ message: "working..." });
});

taskRouter.get(
    "/undo",
    protectedRoute,
    validate(fetchEventSchema as unknown as ValidationSchema),
    async (req, res, next) => {
        try {
            const uid = req.query.uid as string;
            const resp = await adminDb.collection("tasks").doc(uid).update({
                done: false,
            });
            return res.status(200).json(resp);
        } catch (e) {
            next(e);
        }
    }
);

taskRouter.get(
    "/done",
    protectedRoute,
    validate(fetchEventSchema as unknown as ValidationSchema),
    async (req, res, next) => {
        try {
            const uid = req.query.uid as string;
            const resp = await adminDb.collection("tasks").doc(uid).update({
                done: true,
            });
            return res.status(200).json(resp);
        } catch (e) {
            next(e);
        }
    }
);

taskRouter.post(
    "/",
    protectedRoute,
    validate(createTaskSchema as unknown as ValidationSchema),
    async (req, res, next) => {
        try {
            const { name, desc, projectId, assignedTo, dueDate } =
                req.body as BaseTask;
            const docRef = adminDb.collection("tasks").doc();
            const currentUser = res.locals.user as User;
            await docRef.set({
                name,
                desc,
                projectId,
                assignedTo,
                userId: currentUser.uid,
                done: false,
                uid: docRef.id,
                dueDate,
            });
            return res.status(200).json({
                name,
                desc,
                projectId,
                assignedTo,
                userId: currentUser.uid,
                done: false,
                uid: docRef.id,
                dueDate,
            });
        } catch (e) {
            next(e);
        }
    }
);

taskRouter.patch(
    "/",
    protectedRoute,
    validate(fetchEventSchema as unknown as ValidationSchema),
    validate(updateTaskSchema as unknown as ValidationSchema),
    async (req, res, next) => {
        try {
            const uid = req.query.uid as string;
            const { name, desc, assignedTo, projectId } =
                req.body as Partial<BaseTask>;
            const resp = await adminDb.collection("tasks").doc(uid).update({
                name,
                desc,
                assignedTo,
                projectId,
            });
            return res.status(200).json(resp);
        } catch (e) {
            next(e);
        }
    }
);

taskRouter.delete(
    "/",
    protectedRoute,
    validate(fetchEventSchema as unknown as ValidationSchema),
    async (req, res, next) => {
        try {
            const uid = req.query.uid as string;
            const resp = await adminDb.collection("tasks").doc(uid).delete();
            return res.status(200).json(resp);
        } catch (e) {
            next(e);
        }
    }
);
