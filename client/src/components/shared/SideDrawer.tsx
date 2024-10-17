import { Event as EventIcon, Logout, Person, Task } from "@mui/icons-material";
import {
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
} from "@mui/material";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext, MessageContext } from "../../contexts";

export const SideDrawer = () => {
    const authContext = useContext(AuthContext)!;
    const { showMessage } = useContext(MessageContext)!;
    const navigator = useNavigate();

    return (
        <Drawer
            sx={{
                width: 200,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: 200,
                    boxSizing: "border-box",
                },
            }}
            variant="permanent"
            anchor="left"
        >
            <List>
                <ListItem>
                    <Typography
                        variant="h6"
                        component="div"
                        className="w-full flex-grow cursor-pointer text-center text-2xl"
                        onClick={() => navigator("/")}
                    >
                        VENT-SIGN
                    </Typography>
                </ListItem>
                <Divider />
                <ListItem disablePadding>
                    <ListItemButton onClick={() => navigator("/tasks")}>
                        <ListItemIcon>
                            <Task />
                        </ListItemIcon>
                        <ListItemText primary={"Tasks"} />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => navigator("/events")}>
                        <ListItemIcon>
                            <EventIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Events"} />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => navigator("/assigned")}>
                        <ListItemIcon>
                            <Task />
                        </ListItemIcon>
                        <ListItemText primary={"Assigned"} />
                    </ListItemButton>
                </ListItem>
            </List>
            <Divider />
            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => navigator("/account")}>
                        <ListItemIcon>
                            <Person />
                        </ListItemIcon>
                        <ListItemText primary={"Account"} />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton
                        onClick={() => {
                            showMessage(
                                "User Logged out successfully!",
                                "info"
                            );
                            authContext.logOut();
                        }}
                    >
                        <ListItemIcon>
                            <Logout />
                        </ListItemIcon>
                        <ListItemText primary={"Logout"} />
                    </ListItemButton>
                </ListItem>
            </List>
        </Drawer>
    );
};
