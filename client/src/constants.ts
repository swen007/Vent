import colors from "./variables.module.scss";
const currentUrl = window.location.href;
const exp = new RegExp(/https?:\/\/([a-zA-Z0-9.]+):[0-9]+/);
export const BACKEND_URI = `http://${exp.exec(currentUrl)![1]}:8080`;

// export const BACKEND_URI = "http://localhost:8080";
export const COLOR_PRIMARY = colors.primary;
export const COLOR_SECONDARY = colors.secondary;
export const COLOR_BG = colors.bg;
export const COLOR_TEXT = colors.text;
export const COLOR_INFO = colors.info;
export const COLOR_SUCCESS = colors.success;
export const COLOR_WARNING = colors.warning;
export const COLOR_ERROR = colors.error;
