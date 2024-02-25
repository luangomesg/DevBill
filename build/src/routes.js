"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = require("express");
const baseroute_controller_1 = __importDefault(require("./controllers/baseroute.controller"));
const categories_controller_1 = __importDefault(require("./controllers/categories.controller"));
exports.routes = (0, express_1.Router)();
exports.routes.get('/', baseroute_controller_1.default.index);
exports.routes.post('/categories', categories_controller_1.default.create);
