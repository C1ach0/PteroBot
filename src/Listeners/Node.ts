import chalk from "chalk";

export default () => {
    process.on("unhandledRejection", (reason, p) => {
        // console.log(chalk.gray("—————————————————————————————————"));
        // console.log(
        // 	chalk.white("["),
        // 	chalk.red.bold("AntiCrash"),
        // 	chalk.white("]"),
        // 	chalk.gray(" : "),
        // 	chalk.white.bold("Unhandled Rejection/Catch")
        // );
        // console.log(chalk.gray("—————————————————————————————————"));
        // console.log(reason, p);
    });
    process.on("uncaughtException", (err, origin) => {
        // console.log(chalk.gray("—————————————————————————————————"));
        // console.log(
        // 	chalk.white("["),
        // 	chalk.red.bold("AntiCrash"),
        // 	chalk.white("]"),
        // 	chalk.gray(" : "),
        // 	chalk.white.bold("Uncaught Exception/Catch")
        // );
        // console.log(chalk.gray("—————————————————————————————————"));
        // console.log(err, origin);
    });
    process.on("multipleResolves", (type, promise, reason) => {
        // console.log(chalk.gray("—————————————————————————————————"));
        // console.log(
        // 	chalk.white("["),
        // 	chalk.red.bold("AntiCrash"),
        // 	chalk.white("]"),
        // 	chalk.gray(" : "),
        // 	chalk.white.bold("Multiple Resolves")
        // );
        // console.log(chalk.gray("—————————————————————————————————"));
        // console.log(type, promise, reason);
    });
}