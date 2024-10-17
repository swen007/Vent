import { loginPageBg } from "../../assets";

export const ImageBg = () => {
    return (
        <>
            <div className="absolute z-10 h-full w-full bg-bgColor opacity-50"></div>
            <div
                className="absolute h-full w-full bg-cover bg-center blur-sm"
                style={{
                    backgroundImage: `url(${loginPageBg})`,
                }}
            ></div>
        </>
    );
};
