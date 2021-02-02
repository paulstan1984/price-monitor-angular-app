import { EditableObject } from "./EditableObject";
import { Product } from "./Product";
import { Store } from "./Store";

export interface Price extends EditableObject {
    id: number;
    product_id: number;
    product: Product;
    store_id: number;
    store: Store;
    amount: number;
    created_at: Date;
    updated_at: Date;
}
