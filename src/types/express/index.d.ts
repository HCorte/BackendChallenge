// src/types/express/index.d.ts

import {
    UserId,
    Email,
    Username,
    DB,
    FileName,
    //ImagesPath,
} from "../custom.ts";

// to make the file a module and avoid the TypeScript error
export {};

declare global {
    namespace Express {
        export interface Request {
            userId?: UserId;
            email?: Email;
            username?: Username;
            filename?: FileName;
            //images_path?: ImagesPath;
            db?: DB;
        }
    }
}
