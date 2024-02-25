"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
class Category {
    constructor({ id, color, title }) {
        this.id = id;
        this.title = title;
        this.color = color.toUpperCase();
    }
}
exports.Category = Category;
