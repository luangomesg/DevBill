"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const category_entity_1 = require("../entities/category.entity");
class CategoriesService {
    async create() {
        const category = new category_entity_1.Category({
            title: 'Example Category',
            color: '#ff33bb'
        });
        return category;
    }
}
exports.default = new CategoriesService();
