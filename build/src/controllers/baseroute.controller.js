"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const package_json_1 = __importDefault(require("../../package.json"));
class BaseController {
    async index(_, res) {
        const { name, version, description, author } = package_json_1.default;
        res.status(200).json({ name, version, description, author });
    }
}
exports.default = new BaseController();
