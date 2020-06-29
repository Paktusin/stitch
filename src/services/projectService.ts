import {Project} from "../types/project";
import {localStorageService} from "./localStorageService";
import {v4 as uuid} from 'uuid'
import {DbService} from "./dbService";

export class ProjectService {

    dbService: DbService;

    constructor() {
        this.dbService = new DbService('stitch');
        this.dbService.list('projects').then(res => console.log(res));
    }


    // getProject(id: string): Project {
    // }
    //
    // saveProject(project: Project): Project {
    //
    // }
    //
    // removeProject(project: Project) {
    // }
    //
    // list() {
    // }
}

export const projectService = new ProjectService();
