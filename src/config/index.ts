import { merge } from "lodash";

process.env.NODE_ENV = process.env.NODE_ENV || "development";

const stage = process.env.STAGE || "local";

let envConfig;

if (process.env.NODE_ENV === "development") {
    envConfig = require("./local").default;
} else if (process.env.NODE_ENV === "staging") {
    envConfig = require("./staging").default;
} else if (process.env.NODE_ENV === "production") {
    envConfig = require("./prod").default;
}

const defaultConfig = {
    stage,
    dbUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET,
    port: process.env.PORT,
    logging: false,
};

export default merge(defaultConfig, envConfig);
