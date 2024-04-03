import { join } from "path";
import { QuickDB } from "quick.db";

export default class Database extends QuickDB {
    constructor(table: string) {
        super({
            filePath: join(__dirname, "..", "database.sqlite"),
            table
        })
    }
}