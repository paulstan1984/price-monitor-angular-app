import { Product } from "./Product";

export interface ShoppingList {
    items: ShoppingListItem[];
}

export class ShoppingListItem {
    product: Product;
    price: number;
    checked: boolean;
}

export interface GetShoppingListPricesRequest {
    text_lines: string[];
    shopping_list: ShoppingList;
}