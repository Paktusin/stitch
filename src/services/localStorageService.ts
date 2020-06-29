export default class LocalStorageService {
    prefix = '';

    constructor(prefix = '') {
        this.prefix = prefix + '_'
    }

    _get(name: string) {
        return localStorage.getItem(this.prefix + name) as any
    }

    _put(name: string, value: any) {
        localStorage.setItem(this.prefix + name, value);
    }

    has(name: string) {
        return this._get(name) !== null
    }

    remove(name: string) {
        localStorage.removeItem(this.prefix + name);
    }

    get(name: string, defaultValue?: any) {
        let obj = JSON.parse(this._get(name));
        return (obj && obj.hasOwnProperty('value')) ? obj.value : defaultValue;
    }

    put(name: string, value: any) {
        this._put(name, JSON.stringify({time: Date.now(), value: value}));
    }

    time(name: string) {
        let obj = JSON.parse(this._get(name));
        return obj.time;
    }

    fresh(name: string, time: Date) {
        return this.has(name) && this.time(name) > time
    }
}

export const localStorageService = new LocalStorageService('stich');
