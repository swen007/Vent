import Loader from "react-spinners/GridLoader";
import { COLOR_TEXT } from "../constants";

export const LoadingPage = () => {
    return (
        <div className="flex h-full w-screen flex-col items-center justify-center bg-bgColor">
            <Loader size={45} color={COLOR_TEXT} />
        </div>
    );
};
