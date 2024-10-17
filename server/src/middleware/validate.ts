import { NextFunction, Request, Response } from "express";
import { ValidationSchema } from "../types";
import { ValidationError } from "yup";
import createHttpError from "http-errors";

export const validate =
    (schema: ValidationSchema) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.validate({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        } catch (e) {
            if (e instanceof ValidationError) {
                return next(new createHttpError.BadRequest(e.message));
            }
            return next(e);
        }
    };
