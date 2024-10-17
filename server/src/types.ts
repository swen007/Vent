import * as Yup from "yup";

export type ValidationSchema = Yup.ObjectSchema<
    {
        body: any;
        params: any;
        query: any;
    },
    Yup.AnyObject
>;

export interface BaseUser {
    email: string;
    name: string;
    password: string;
    role: string;
}

export interface FetchedUser {
    email: string;
    name: string;
    uid: string;
    role: string;
}

export type User = FetchedUser & {
    role: Role;
};

export interface Role {
    roleName: string;
    accessLevel: number;
}

export type Roles = Record<string, Role>;

export interface BaseEvent {
    name: string;
    desc: string;
}

export type FetchedEvent = BaseEvent & {
    uid: string;
    done: boolean;
    createdBy: string;
};

export interface BaseTask {
    name: string;
    desc: string;
    projectId: string;
    assignedTo: string;
    dueDate: string;
}

export type FetchedTask = BaseTask & {
    userId: string;
    uid: string;
    done: boolean;
};
