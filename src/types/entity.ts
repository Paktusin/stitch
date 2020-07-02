export class Entity {
    id?: string;
    createdAt: number = new Date().getTime();
    updatedAt: number = new Date().getTime();

    import(object: any) {
        Object.keys(object).forEach(key => {
            // @ts-ignore
            this[key] = object[key];
        })
        return this;
    }
}
