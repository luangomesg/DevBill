"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = require("express");
const baseroute_controller_1 = __importDefault(require("./app/controllers/baseroute.controller"));
const categories_controller_1 = __importDefault(require("./app/controllers/categories.controller"));
const transactions_controller_1 = __importDefault(require("./app/controllers/transactions.controller"));
exports.routes = (0, express_1.Router)();
exports.routes.get('/', baseroute_controller_1.default.index);
exports.routes.get('/categories', categories_controller_1.default.index);
exports.routes.post('/categories', categories_controller_1.default.create);
exports.routes.get('/transactions/dashboard', transactions_controller_1.default.getDashboard);
exports.routes.get('/transactions/financial-evolution', transactions_controller_1.default.getFinancial);
exports.routes.get('/transactions', transactions_controller_1.default.index);
exports.routes.post('/transactions', transactions_controller_1.default.create);
