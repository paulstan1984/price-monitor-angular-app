import { EditableObject } from "./EditableObject";

export interface Category extends EditableObject {
    id: number;
    name: string;
    created_at: Date;
    updated_at: Date;
}