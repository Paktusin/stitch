export class DbService {

    idbFactory: IDBFactory;

    constructor(private name: string, private schema: string[], private version: number) {
        // @ts-ignore
        this.idbFactory = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
        if (!this.idbFactory) {
            throw  new Error("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
        }
    }

    open(): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            const request = this.idbFactory.open(this.name, this.version);
            request.onerror = () => new Error('You need to allow database');
            request.onsuccess = (event: any) => {
                resolve(event.target.result);
            }
            request.onupgradeneeded = (event: any) => {
                console.log('onupgradeneeded');
                const db = event.target.result;
                this.schema.forEach(table => {
                    db.createObjectStore(table, {keyPath: 'id'})
                })
            }
        })
    }

    async store(name: string): Promise<IDBObjectStore> {
        const db = await this.open();
        return db.transaction(name, 'readwrite').objectStore(name);
    }
}
