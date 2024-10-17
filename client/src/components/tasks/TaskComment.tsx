import {
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Divider,
    Typography,
} from "@mui/material";
import dayjs from "dayjs";
import React from "react";

export const TaskComment = ({
    name,
    comment,
    time,
}: {
    name: string;
    comment: string;
    time: string;
}) => {
    return (
        <>
            <ListItem alignItems="flex-start" className="mb-2">
                <ListItemAvatar>
                    <Avatar alt={name} src="invalid path" />
                </ListItemAvatar>
                <ListItemText
                    primary={name}
                    secondary={
                        <div className="flex flex-col">
                            {comment}
                            <Typography
                                // sx={{ display: "inline" }}
                                component="span"
                                variant="body2"
                                color="text.primary"
                                className="font-bold"
                            >
                                {dayjs(time).format("HH:mm DD/MM/YYYY")}{" "}
                            </Typography>
                        </div>
                    }
                />
            </ListItem>
            <Divider
                // component="li"
                className="mb-2 w-[90%]"
            />
        </>
    );
};
