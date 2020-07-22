import morgan from "morgan";
import chalk from "chalk";

const morganChalk = morgan(function (tokens, req, res) {
  return [
    chalk.red.bold(tokens.method(req, res)),
    chalk.white(tokens.status(req, res)),
    chalk.blue(tokens.url(req, res)),
    chalk.yellow((tokens["response-time"](req, res))[0] + " ms"),
  ].join(" ");
});

export { morganChalk };
