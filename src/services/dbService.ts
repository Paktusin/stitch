export class DbService {

    idbFactory: IDBFactory;
    db: IDBDatabase = new IDBDatabase();

    constructor(private name: string) {
        // @ts-ignore
        this.idbFactory = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
        if (!this.idbFactory) {
            throw  new Error("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
        }
    }

    init(): Promise<any> {
        return new Promise((resolve, reject) => {
            const request = this.idbFactory.open('stitch');
            request.onerror = () => new Error('You need to allow database');
            request.onupgradeneeded = (event: any) => {
                this.db = event.target.result as IDBDatabase;
            }
        })
    }

    list(name: string): Promise<any> {
        return new Promise(resolve => {
            const request = this.db.transaction(name, "readwrite").objectStore("name").getAll()
            request.onsuccess = () => {
                resolve(request.result);
            }
        })
    }

    async createStorage(name: string) {
        this.db?.createObjectStore(name);
    }
}
