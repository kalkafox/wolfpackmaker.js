import c from "ansi-colors";
import { config } from "./config.js";

const prefix = `📝 ${c.yellow("[")}${c.cyan(
  new Date().toLocaleString()
)}${c.yellow("]")}`;

export const log = {
  info: (message) => {
    console.log(`${prefix} ${c.green("[INFO]")}: ${c.green(message)}`);
  },
  warn: (message) => {
    console.warn(`${prefix} ${c.yellow("[WARN]")}: ${c.yellow(message)}`);
  },
  error: (message) => {
    console.error(`${prefix} ${c.red("[ERROR]")}: ${c.red(message)}`);
  },
  debug: (message) => {
    config.debugMode &&
      console.log(`${prefix} ${c.magenta("[DEBUG]")}: ${c.magenta(message)}`);
  },
  trace: (message) => {
    console.trace(
      `${prefix} ${c.cyanBright("[TRACE]")}: ${c.cyanBright(message)}`
    );
  },
};
