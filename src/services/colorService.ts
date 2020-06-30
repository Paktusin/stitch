export class ColorService {
    getHexContrast(hex: string = '#fff', bw = true) {
        if (hex.indexOf('#') === 0) {
            hex = hex.slice(1);
        }
        if (hex.length === 3) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        if (hex.length !== 6) {
            throw new Error('Invalid HEX color.');
        }
        let r: any = parseInt(hex.slice(0, 2), 16),
            g: any = parseInt(hex.slice(2, 4), 16),
            b: any = parseInt(hex.slice(4, 6), 16);
        if (bw) {
            return (r * 0.299 + g * 0.587 + b * 0.114) > 186
                ? '#000000'
                : '#FFFFFF';
        }
        r = (255 - r).toString(16);
        g = (255 - g).toString(16);
        b = (255 - b).toString(16);
        return "#" + this.padZero(r) + this.padZero(g) + this.padZero(b);
    }

    strRgbContrast(str: string = 'rgb(0,0,0)') {
        return this.getHexContrast(this.strRgbToHex(str));
    }

    strRgbToHex(str: string) {
        const matchColors = /rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)/;
        const match = matchColors.exec(str);
        if (match && match[1] && match[2] && match[3]) {
            return this.rgbToHex(parseInt(match[1]),parseInt(match[2]), parseInt(match[3]))
        }
        throw new Error('string is not rgba')
    }

    private padZero(str: string, len: number = 2) {
        let zeros = new Array(len).join('0');
        return (zeros + str).slice(-len);
    }

    private componentToHex(c: number) {
        const hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    private rgbToHex(r: number, g: number, b: number) {
        return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    }
}

export const colorService = new ColorService();
