// import {
//     promises as fs
// } from 'fs.promises';
import fs from "fs";
import path from "path";
import util from "util";

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
//const makeDir = util.promisify(fs.mkdir);

export default class personalizedFile {
    constructor(
        public folder: string,
        public filename: string
    ) {
        this.folder = folder; //'data'
        this.filename = filename; //'products.json'
    }

    // get filePath() {
    //     if (
    //         fs.existsSync(path.join(path.dirname(process.argv[1]), this.folder))
    //     ) {
    //         return path.join(
    //             path.dirname(process.argv[1]),
    //             this.folder,
    //             this.filename
    //         );
    //     } else {
    //         return async () => {
    //             await makeDir(
    //                 path.join(path.dirname(process.argv[1]), this.folder)
    //             );
    //             return path.join(
    //                 path.dirname(process.argv[1]),
    //                 this.folder,
    //                 this.filename
    //             );
    //         };
    //     }
    // }

    get filePath() {
        return path.join(
            path.dirname(process.argv[1]),
            this.folder,
            this.filename
        );
    }

    async writeFile(data: string | NodeJS.ArrayBufferView) {
        return await writeFile(await this.filePath, JSON.stringify(data));
    }

    async readFile() {
        const buffer = await readFile(this.filePath, "utf-8");
        return buffer.length > 0 ? JSON.parse(buffer) : [];
    }
}
