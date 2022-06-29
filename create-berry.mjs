#!/usr/bin/env node

import { execSync } from "child_process";
import { existsSync, readFileSync, writeFileSync } from "fs";

const editorConfig =
  "root = true\n" +
  "\n" +
  "[*]\n" +
  "end_of_line = lf\n" +
  "insert_final_newline = true\n" +
  "\n" +
  "[*.{js,json,yml}]\n" +
  "charset = utf-8\n" +
  "indent_style = space\n" +
  "indent_size = 2\n";

const gitIgnore =
  ".yarn/*\n" +
  "!.yarn/patches\n" +
  "!.yarn/plugins\n" +
  "!.yarn/releases\n" +
  "!.yarn/sdks\n" +
  "!.yarn/versions\n" +
  "\n" +
  "# Swap the comments on the following lines if you don't wish to use zero-installs\n" +
  "# Documentation here: https://yarnpkg.com/features/zero-installs\n" +
  "!.yarn/cache\n" +
  "#.pnp.*\n";

const yarnVersion = execSync("yarn --version").toString().trim();

function run(cmd) {
  console.log("$", cmd);
  execSync(cmd, { stdio: "inherit" });
}

console.log("=> Current Yarn version", yarnVersion);

if (yarnVersion > "2") {
  console.log("=> Already running on Yarn berry");
} else {
  console.log("=> Not running on Yarn berry yet, need to upgrade Yarn");
  run("yarn set version berry");
}

console.log("=> Upgrading to latest stable Yarn version");
run("yarn set version stable");

function fileContains(file, content) {
  return readFileSync(file, "utf8").includes(content);
}

if (fileContains(".yarnrc.yml", "nodeLinker")) {
  console.log("=> nodeLinker already set");
} else {
  console.log("=> Setting nodeLinker");
  const originalContent = readFileSync(".yarnrc.yml");
  writeFileSync(
    ".yarnrc.yml",
    Buffer.concat([Buffer.from("nodeLinker: node-modules\n"), originalContent])
  );
}

if (!existsSync(".editorconfig")) {
  console.log("=> Creating .editorconfig");
  writeFileSync(".editorconfig", editorConfig);
} else {
  console.log("=> .editorconfig already exists");
}

if (!existsSync(".gitignore")) {
  console.log("=> Creating .gitignore");
  writeFileSync(".gitignore", gitIgnore);
} else if (!fileContains(".gitignore", ".yarn/")) {
  console.log("=> Adding Yarn entries to .gitignore");
  const originalContent = readFileSync(".gitignore");
  writeFileSync(
    ".gitignore",
    Buffer.concat([originalContent, Buffer.from("\n"), Buffer.from(gitIgnore)])
  );
} else {
  console.log("=> .gitignore already contains Yarn entries");
}
