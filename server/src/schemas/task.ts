import * as Yup from "yup";

export const createTaskSchema = Yup.object({
    body: Yup.object({
        name: Yup.string().min(3).max(52).required(),
        desc: Yup.string().min(6).max(1000).required(),
        projectId: Yup.string().min(1).max(128).required(),
        assignedTo: Yup.string().min(1).max(128).required(),
    }),
});

export const updateTaskSchema = Yup.object({
    body: Yup.object({
        name: Yup.string().min(3).max(52),
        desc: Yup.string().min(6).max(1000),
        projectId: Yup.string().min(1).max(128),
        assignedTo: Yup.string().min(1).max(128),
    }),
});
