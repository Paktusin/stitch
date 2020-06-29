export class Entity {
    id?: string

    import(object: any) {
        Object.keys(object).forEach(key => {
            // @ts-ignore
            this[key] = object[key];
        })
        return this;
    }
}
