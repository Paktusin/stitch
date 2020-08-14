import {Project} from "../types/project";

export class FileService {

    readonly extension = '.stitch';

    export(object: any, name: string = 'file.json') {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(object));
        const dlAnchorElem = document.createElement('a');
        dlAnchorElem.setAttribute("href", dataStr);
        dlAnchorElem.setAttribute("download", name);
        dlAnchorElem.click();
        dlAnchorElem.remove();
    }

    exportProject(project: Project) {
        this.export(project, project.name + this.extension);
    }

    importProject(): Promise<Project> {
        return this.import<Project>('.stitch')
    }

    import<T = any>(accept: string): Promise<T> {
        return new Promise(resolve => {
            const input = document.createElement('input');
            input.setAttribute('type', 'file');
            if (accept) input.setAttribute('accept', accept);
            input.addEventListener('change', (event: Event) => {
                if (input.files && input.files.length) {
                    const file = input.files[0] as File;
                    const reader = new FileReader();
                    reader.readAsText(file);
                    reader.onload = () => {
                        resolve(JSON.parse(reader.result as string))
                        input.remove();
                    }
                } else {
                    input.remove();
                }
            });
            input.click();
        })
    }
}

export const fileService = new FileService();
