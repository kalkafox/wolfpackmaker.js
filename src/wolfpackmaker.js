import { log } from "./logger.js";
import appData from "../package.json" assert { type: "json" };
import { ArgumentParser } from "argparse";
import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import YAML from "yaml";

import { config, fetchConfig } from "./config.js";

const pargeArgs = () => {
  const parser = new ArgumentParser({
    add_help: true,
    description: "wolfpackmaker",
  });
  parser.add_argument("-v", "--verbose", {
    action: "store_true",
    default: config.debugMode,
    help: "increase output verbosity",
  });
  parser.add_argument("module", {
    help: "Module to build",
    nargs: "*",
    default: ["assemble"],
  });
  const args = parser.parse_args();
  if (args.verbose) {
    config.debugMode = true;
  }
  log.debug("Verbose mode enabled");
  log.debug("Made with 🐾 by Kalka (https://github.com/WolfpackMC)");
  return args;
};

export const run = () => {
  log.info(`${appData.name} ${appData.version} (node.js version)`);
  const args = pargeArgs();

  log.info("Loading CurseForge API key...");
  config.apiKey = fs.readFileSync("./key", "utf8");

  if (args.module) {
    const module = args.module[0];
    log.info(`Module: ${module}`);
    switch (module) {
      case "lock":
        lock(args);
        break;
      case "assemble":
        log.info("Assembling...");
        break;
      default:
        log.error(`Module ${module} not found`);
        break;
    }
  }
};

const lock = async (args) => {
  let manifestPath = "./manifest.yml";
  args.module.forEach((string) => {
    if (string.includes("manifest")) {
      manifestPath = string.split("=")[1];
    }
  });
  log.info(`Checking ${manifestPath} for a manifest...`);
  if (fs.existsSync(manifestPath)) {
    log.info(`Manifest found!`);
    const manifest = YAML.parse(fs.readFileSync(manifestPath, "utf8"));
    log.debug("Parsed YAML successfully.");
    const modsInfo = await getModsInfo(manifest);
  } else {
    log.error(
      `Manifest not found... Are you sure you're in the right directory?`
    );
  }
};

const getModsInfo = async (manifest) => {
  const modpackDetails = {
    modloader: manifest.modloader,
    version: manifest.version,
  };
  const modsInfo = [];
  for (const mod of manifest.mods) {
    const modInfo = await getModInfo(mod, modpackDetails);
    if (modInfo === null) {
      log.error(`Mod ${mod.name} not found!`);
    }
    //mods_info.push(mod_info);
  }
  return modsInfo;
};

const getModInfo = async (mod, modpackDetails) => {
  if (mod.id) {
    log.info(`[${mod.name}] Getting mod info by id... (${mod.id})`);
    const modInfo = await getModInfoById(mod.id, modpackDetails);
    return modInfo;
  }
  if (mod.name) {
    log.info(`[${mod.name}] Getting mod info by name...`);
    const modInfo = await getModInfoByName(mod.name, modpackDetails);
    return modInfo;
  }
  return null;
};

const getModInfoById = async (id, modpackDetails) => {
  return null;
};

const getModInfoByName = async (name, modpackDetails) => {
  console.log(fetchConfig.baseUrl);
  const res = await fetch(
    `${fetchConfig.baseUrl}v1/mods/search?gameId=432&gameVersion=${modpackDetails.version}
    }&slug=${name}`,
    {
      method: "GET",
      headers: fetchConfig.headers,
    }
  );
  log.info(await res.status);
  log.info(await res.text());
  return null;
};
