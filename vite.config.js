import fs from "node:fs";
import path from "node:path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import { contact, education, profile, site, socials } from "./src/data/portfolio.js";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function siteOrigin() {
  return String(site.url || "https://balaji-vijayan.onrender.com").replace(/\/$/, "");
}

function robotsTxt(origin) {
  return `User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${origin}/sitemap.xml\n`;
}

function sitemapXml(origin) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${origin}/</loc>\n  </url>\n</urlset>\n`;
}

function htmlMeta(env) {
  const origin = siteOrigin();
  const ogImage = `${origin}/og.png`;
  const canonical = `<link rel="canonical" href="${escapeHtml(origin)}/" />\n    <meta property="og:url" content="${escapeHtml(origin)}/" />`;
  const verification = String(env.VITE_GOOGLE_SITE_VERIFICATION || site.googleSiteVerification || "").trim();
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.title,
    url: `${origin}/`,
    email: contact.email,
    sameAs: socials.map((item) => item.href),
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: education[0].school,
    },
  }).replaceAll("<", "\\u003c");

  return {
    name: "portfolio-html-meta",
    transformIndexHtml(html) {
      return html
        .replaceAll("%SITE_TITLE%", escapeHtml(site.title))
        .replaceAll("%SITE_DESCRIPTION%", escapeHtml(site.description))
        .replaceAll("%SITE_AUTHOR%", escapeHtml(site.author))
        .replaceAll("%SITE_THEME%", escapeHtml(site.themeColor))
        .replaceAll("%OG_IMAGE%", escapeHtml(ogImage))
        .replaceAll("%CANONICAL%", canonical)
        .replaceAll("%GOOGLE_SITE_VERIFICATION%", escapeHtml(verification))
        .replaceAll("%JSON_LD%", jsonLd);
    },
    closeBundle() {
      const outDir = path.resolve("dist");
      if (!fs.existsSync(outDir)) return;
      fs.writeFileSync(path.join(outDir, "robots.txt"), robotsTxt(origin));
      fs.writeFileSync(path.join(outDir, "sitemap.xml"), sitemapXml(origin));
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
  plugins: [react(), tailwindcss(), htmlMeta(env)],
  server: {
    host: "0.0.0.0",
    port: 4321,
    strictPort: true,
  },
  preview: {
    host: "0.0.0.0",
    port: 4321,
    strictPort: true,
  },
};
});
