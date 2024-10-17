import { useState, useContext } from "react";
import { EditEmail, EditName, EditPassword, ImageBg } from "../components";
import { AuthContext } from "../contexts";
import { Abc, Edit, AccountCircle, Password, Lock } from "@mui/icons-material";
import {
    Typography,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    IconButton,
} from "@mui/material";

export const AccountPage = () => {
    const [editEmail, setEditEmail] = useState<boolean>(false);
    const [editName, setEditName] = useState<boolean>(false);
    const [editPassword, setEditPassword] = useState<boolean>(false);

    const authContext = useContext(AuthContext)!;

    return (
        <div className="relative ml-[200px] flex h-full w-[calc(100%-200px)] flex-col items-center justify-center bg-bgColor">
            <ImageBg />
            <EditEmail
                open={editEmail}
                handleClose={() => setEditEmail(false)}
            />
            <EditPassword
                open={editPassword}
                handleClose={() => setEditPassword(false)}
            />
            <EditName open={editName} handleClose={() => setEditName(false)} />
            <div className="z-10 w-11/12 rounded-md bg-textColor p-4 text-bgColor">
                <Typography className="text-center" variant="h4">
                    Accounts Page
                </Typography>
                <Divider className="mt-4" />
                <List className="flex flex-col items-center justify-center">
                    <ListItem disablePadding className="mt-4">
                        <ListItemIcon>
                            <Abc
                                fontSize="large"
                                className="text-center text-bgColor"
                            />
                        </ListItemIcon>
                        <>
                            <ListItemText className="text-center">
                                <Typography variant="h5">
                                    {authContext.userDetails?.name}
                                </Typography>
                            </ListItemText>
                            <IconButton onClick={() => setEditName(true)}>
                                <Edit
                                    fontSize="medium"
                                    className="text-bgColor"
                                />
                            </IconButton>
                        </>
                    </ListItem>
                    <ListItem disablePadding className="mt-4">
                        <ListItemIcon>
                            <Lock
                                fontSize="large"
                                className="text-center text-bgColor"
                            />
                        </ListItemIcon>
                        <>
                            <ListItemText className="text-center">
                                <Typography variant="h5">
                                    {authContext.userDetails?.role.roleName}
                                </Typography>
                            </ListItemText>
                            <IconButton disabled className="opacity-20">
                                <Edit
                                    fontSize="medium"
                                    className="text-bgColor"
                                />
                            </IconButton>
                        </>
                    </ListItem>
                    <ListItem disablePadding className="mt-4">
                        <ListItemIcon>
                            <AccountCircle
                                fontSize="large"
                                className="text-center text-bgColor"
                            />
                        </ListItemIcon>
                        <>
                            <ListItemText className="text-center">
                                <Typography variant="h5">
                                    {authContext.userDetails?.email}
                                </Typography>
                            </ListItemText>
                            <IconButton onClick={() => setEditEmail(true)}>
                                <Edit
                                    fontSize="medium"
                                    className="text-bgColor"
                                />
                            </IconButton>
                        </>
                    </ListItem>
                    <ListItem disablePadding className="mt-4">
                        <ListItemIcon>
                            <Password
                                fontSize="large"
                                className="text-center text-bgColor"
                            />
                        </ListItemIcon>
                        <>
                            <ListItemText className="text-center">
                                <Typography variant="h5">********</Typography>
                            </ListItemText>
                            <IconButton onClick={() => setEditPassword(true)}>
                                <Edit
                                    fontSize="medium"
                                    className="text-bgColor"
                                />
                            </IconButton>
                        </>
                    </ListItem>
                </List>
            </div>
        </div>
    );
};
