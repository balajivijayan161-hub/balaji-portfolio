import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const distDir = path.resolve("dist");
const sourcePath = path.join(distDir, "index.html");
const adminDir = path.join(distDir, "admin");
const targetPath = path.join(adminDir, "index.html");

const robotsMeta = '<meta name="robots" content="noindex, nofollow" />';
let html = readFileSync(sourcePath, "utf8");

if (!/name=["']robots["']/i.test(html)) {
  if (!html.includes("</head>")) {
    throw new Error("dist/index.html has no </head>, so the admin noindex tag cannot be added");
  }
  html = html.replace("</head>", `    ${robotsMeta}\n  </head>`);
}

mkdirSync(adminDir, { recursive: true });
writeFileSync(targetPath, html);
