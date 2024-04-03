import chalk from "chalk";

export class Logger {
    getDateFormat(): string {
        const nowDate = new Date();
        let format = [
            `[${nowDate.getFullYear()}-${nowDate.getMonth()}-${nowDate.getDate()}`,
            `${nowDate.getHours()}:${nowDate.getMinutes()}:${nowDate.getSeconds()}]`
        ]
        return chalk.white(format.join(" | "))
    }

    getLog(status: string | Status, message: string): string {
        const statusEnum = typeof status === "string" ? Status[status] : status;
        switch (statusEnum) {
            case Status.SUCCESS:
                return `${this.getDateFormat()} ${chalk.green(message)}`;
            case Status.WARNING:
                return `${this.getDateFormat()} ${chalk.yellow(message)}`;
            case Status.ERROR:
                return `${this.getDateFormat()} ${chalk.red(message)}`;
            default:
                return `${this.getDateFormat()} ${chalk.blue(message)}`;
        }
    }

    sendLog(status: string | Status, message: string): void {
        const statusEnum = typeof status === "string" ? Status[status] : status;
        switch (statusEnum) {
            case Status.SUCCESS:
                return console.log(`${this.getDateFormat()} ${chalk.green(message)}`);
            case Status.WARNING:
                return console.log(`${this.getDateFormat()} ${chalk.yellow(message)}`);
            case Status.ERROR:
                return console.log(`${this.getDateFormat()} ${chalk.red(message)}`);
            default:
                return console.log(`${this.getDateFormat()} ${chalk.blue(message)}`);
        }
    }
    
}

interface LogEntry {
    name: string;
    check: string;
}
  

export enum Status {
    SUCCESS = "SUCCESS",
    WARNING = "WARNING",
    ERROR = "ERROR",
}