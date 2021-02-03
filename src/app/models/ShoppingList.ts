import { Product } from "./Product";

export interface ShoppingList {
    items: ShoppingListItem[];
}

export class ShoppingListItem {
    product: Product;
    price: number;
    checked: boolean;
}