import {DbService} from "./dbService";
import {Project} from "../types/project";
import {Entity} from "../types/entity";
import {v4 as uuid} from 'uuid';

const tables = [
    Project
]

const DB_VERSION = 2;
const DB_NAME = 'stitch';

export class DataService<T extends Entity> {

    dbService: DbService;

    constructor(private className: any) {
        const tableNames = tables.map(cls => cls.name);
        this.dbService = new DbService(DB_NAME, tableNames, DB_VERSION);
    }

    async get(id: string): Promise<T> {
        return this.request((store) => store.get(id))
    }

    async save(entity: T): Promise<T> {
        if (entity.id) {
            entity.id = uuid();
        }
        return this.request((store) => store.put(entity, entity.id))
    }

    async delete(entity: T): Promise<T> {
        return this.request((store) => store.delete(entity.id as string))
    }

    async list(): Promise<T[]> {
        return this.request<T[]>((store) => store.getAll()).then(res => res.map(entity => {
            return new this.className()
        }))
    }

    async request<T = void>(fn: (store: IDBObjectStore) => IDBRequest): Promise<T> {
        const store = await this.dbService.store(this.className.name)
        return new Promise(res => fn(store).onsuccess = (event: any) => res(event.target.result))
    }
}

export const projectService = new DataService<Project>(Project)
