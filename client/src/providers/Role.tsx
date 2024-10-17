import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { RoleContext } from "../contexts";
import { db } from "../firebase";
import { LoadingPage } from "../pages";
import { AutoCompleteOption, Role } from "../types";

interface PropsInterface {
    children: React.ReactNode;
}

export const RoleProvider = ({ children }: PropsInterface) => {
    const [loading, setLoading] = useState(true);
    const [roles, setRoles] = useState<Record<string, Role>>({});

    useEffect(() => {
        getDocs(collection(db, "roles"))
            .then((docsRef) => {
                docsRef.docs.forEach((doc) => {
                    setRoles((old) => {
                        console.log("setting roles");
                        return { ...old, [doc.id]: doc.data() as Role };
                    });
                });
                setLoading(false);
            })
            .catch((err) => {
                console.trace(err);
            });
    }, []);

    const rolesChoices = useMemo(() => {
        const temp: AutoCompleteOption[] = [];
        Object.keys(roles).forEach((key) => {
            temp.push({
                label: roles[key].roleName,
                value: key,
            });
        });
        return temp.sort((a, b) => {
            if (a.label < b.label) {
                return -1;
            } else if (b.label > a.label) {
                return 1;
            }
            return 0;
        });
    }, [roles]);

    const getRole = (uid: string) => {
        return roles[uid]!;
    };

    const getRoleByAccessLevel = (accessLevel: number) => {
        let role: Role = { accessLevel, roleName: "asd" };
        Object.keys(roles).forEach((key) => {
            if (roles[key].accessLevel === accessLevel) {
                role = roles[key];
            }
        });
        return role;
    };

    return (
        <RoleContext.Provider
            value={{ getRole, roles, rolesChoices, getRoleByAccessLevel }}
        >
            {loading && <LoadingPage />}
            {!loading && children}
        </RoleContext.Provider>
    );
};
