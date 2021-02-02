import { Category } from "./Category";
import { EditableObject } from "./EditableObject";

export interface Product extends EditableObject {
    id: number;
    name: string;
    category_id: number;
    category: Category;
    stores: string;
    lastPrice: number;
    avgPrice: number;
    created_at: Date;
    updated_at: Date;
}