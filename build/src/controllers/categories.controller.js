"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const categories_services_1 = __importDefault(require("../services/categories.services"));
class CategoriesController {
    async create(_, res) {
        const result = await categories_services_1.default.create();
        return res.status(201).json(result);
    }
}
exports.default = new CategoriesController();
