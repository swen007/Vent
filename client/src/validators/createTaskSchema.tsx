import * as Yup from "yup";

export const createTaskSchema = Yup.object({
    name: Yup.string().min(3).max(52).required(),
    desc: Yup.string().min(6).max(1000).required(),
    projectId: Yup.string().min(1).max(128).required(),
    assignedTo: Yup.string().min(1).max(128).required(),
    dueDate: Yup.string().test("valid-date", "Invalid Date Format", (value) => {
        if (!value) return false;
        const pattern = /^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[0-2])\/\d{4}$/;
        return pattern.test(value);
    }),
});
