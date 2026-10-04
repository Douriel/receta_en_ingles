import { WritableSignal } from "@angular/core";
import { SchemaPath, validate } from "@angular/forms/signals";

export function nameExists(path: SchemaPath<string>, names: WritableSignal<string[]>, options?: {message?: string}){
    validate(path, ({value}) => {
        if(names().includes(value())){
            return {
                kind: 'nameExists',
                message: options?.message || 'Name already taken',
            };
        }
        return null;
    }
)
}