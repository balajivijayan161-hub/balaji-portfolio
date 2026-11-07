import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { profile, projects, site } from "../src/data/portfolio.js";

const distDir = path.resolve("dist");
const sourcePath = path.join(distDir, "index.html");
const html = readFileSync(sourcePath, "utf8");

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function writeHtml(directory, contents) {
  mkdirSync(directory, { recursive: true });
  writeFileSync(path.join(directory, "index.html"), contents);
}

const robotsMeta = '<meta name="robots" content="noindex, nofollow" />';
if (!/name=["']robots["']/i.test(html)) {
  if (!html.includes("</head>")) {
    throw new Error("dist/index.html has no </head>, so the admin noindex tag cannot be added");
  }
}
const adminHtml = /name=["']robots["']/i.test(html)
  ? html
  : html.replace("</head>", `    ${robotsMeta}\n  </head>`);
writeHtml(path.join(distDir, "admin"), adminHtml);

const origin = String(site.url || "https://balaji-vijayan.onrender.com").replace(/\/$/, "");

for (const project of projects) {
  const title = `${project.title} — ${profile.name}`;
  const url = `${origin}/projects/${project.id}`;
  const safeTitle = escapeHtml(title);
  const safeUrl = escapeHtml(url);
  let page = html;
  if (!/<title>[^<]*<\/title>/.test(page)) {
    throw new Error("dist/index.html has no <title>, so the project page title cannot be set");
  }
  page = page.replace(/<title>[^<]*<\/title>/, `<title>${safeTitle}</title>`);
  page = page.replace(/<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${safeUrl}" />`);
  page = page.replace(/<meta property="og:url" content="[^"]*"\s*\/>/, `<meta property="og:url" content="${safeUrl}" />`);
  page = page.replace(/<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${safeTitle}" />`);
  page = page.replace(/<meta name="twitter:title" content="[^"]*"\s*\/>/, `<meta name="twitter:title" content="${safeTitle}" />`);
  if (/name=["']robots["']/i.test(page)) {
    throw new Error(`Project page for ${project.id} picked up a robots meta tag`);
  }
  writeHtml(path.join(distDir, "projects", project.id), page);
}
