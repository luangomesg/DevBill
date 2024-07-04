"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const database_1 = __importDefault(require("./database"));
const routes_1 = require("./routes");
database_1.default.mongo().then(() => {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)({
        origin: process.env.FRONT_URL
    }));
    app.use(express_1.default.json());
    app.use(routes_1.routes);
    app.listen(3333, () => console.log('🚀 app running on the port 3333'));
});
