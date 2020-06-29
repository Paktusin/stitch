import {DbService} from "./dbService";
import {Project} from "../types/project";
import {Entity} from "../types/entity";
import {v4 as uuid} from 'uuid';

const tables = [
    'project'
]

const DB_VERSION = 2;

export class DataService<T extends Entity> {

    dbService: DbService;

    constructor(private name: typeof tables[number]) {
        this.dbService = new DbService('stitch', tables, DB_VERSION);
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
        return this.request<T[]>((store) => store.getAll())
    }

    async request<T = void>(fn: (store: IDBObjectStore) => IDBRequest): Promise<T> {
        const store = await this.dbService.store(this.name)
        return new Promise(res => fn(store).onsuccess = (event: any) => res(event.target.result))
    }
}

export const projectService = new DataService<Project>('project')
