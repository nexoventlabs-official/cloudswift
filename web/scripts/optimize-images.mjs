#!/usr/bin/env node
/**
 * Converts every image to AVIF + WebP (+ original fallback) at 400/800/1200/1600w.
 *
 * Usage:
 *   node scripts/optimize-images.mjs --input ./images --output ./optimized --heroes-all
 *
 * Output: optimized/[filename]-[width].[format]
 */
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";

const WIDTHS = [400, 800, 1200, 1600];
const HERO_MAX_BYTES = 150 * 1024;
const BODY_MAX_BYTES = 80 * 1024;
const INPUT_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".tif", ".tiff", ".gif"]);

/** Raw filename -> public slug used on AI service pages. */
const SLUGS = {
  "Customer support agents- AI website.png": "customer-support-agents",
  "Enterprsie knowledge agents- AI web.png": "enterprise-knowledge-base-agents",
  "AI HR Assistant- AI web.jpg": "ai-hr-assistant",
  "AIHRassistant-AI.jpg": "ai-hr-assistant",
  "Sales agent-AI.jpg": "ai-sales-assistant",
  "AIsalesassistant- AI.jpg": "ai-sales-assistant",
  "Enterprise Chatbots- AI web.jpg": "enterprise-chatbots",
  "enterprisechatbot-AI.jpg": "enterprise-chatbots",
  "AI workflows Automations.jpg": "ai-workflow-automation",
  "AI model deployment- AI web.jpg": "ai-model-deployment",
  "AI model monitoring-AI web.jpg": "ai-model-monitoring",
  "AImodeldevelopment-AI.png": "ai-development-services",
  "ai assessment.webp": "ai-readiness-assessment",
  "AIdevelopmentservice.webp": "ai-development-services",
  "aiinfra.webp": "ai-infrastructure",
  "AIMVPImage.webp": "ai-mvp-development",
  "AISaasSdevelopmentAI 1.webp": "ai-saas-product-development",
  "chatgpt.webp": "chatgpt-enterprise-integration",
  "CustomAIagentsimage.webp": "multi-agent-systems",
  "roadmap.webp": "ai-strategy-roadmap",
};

/** Optional: only process these basenames (use with --batch). */
const BATCH = new Set([
  "ai assessment.webp",
  "AIdevelopmentservice.webp",
  "aiinfra.webp",
  "AIMVPImage.webp",
  "AISaasSdevelopmentAI 1.webp",
  "chatgpt.webp",
  "CustomAIagentsimage.webp",
  "roadmap.webp",
]);

function arg(flag, fallback = undefined) {
  const i = process.argv.indexOf(flag);
  if (i === -1) return fallback;
  return process.argv[i + 1] ?? fallback;
}

const inputDir = path.resolve(arg("--input", "./images"));
const outputDir = path.resolve(arg("--output", "./optimized"));
const publicDir = arg("--public")
  ? path.resolve(arg("--public"))
  : path.resolve("./public/images/cs/ai-services");
const heroFile = arg("--hero", "");
const heroesAll = process.argv.includes("--heroes-all");
const batchOnly = process.argv.includes("--batch");
const startAvif = Number(arg("--quality-avif", "50"));
const startWebp = Number(arg("--quality-webp", "72"));
const startJpeg = Number(arg("--quality-jpeg", "78"));
const optPublicDir = path.join(publicDir, "opt");

function slugify(name) {
  return (
    SLUGS[name] ||
    path
      .basename(name, path.extname(name))
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  );
}

async function encodeToBudget(pipeline, format, maxBytes, startQuality) {
  let quality = startQuality;
  let buf;
  for (let i = 0; i < 8; i++) {
    const q = Math.max(20, quality);
    if (format === "avif") {
      buf = await pipeline.clone().avif({ quality: q, effort: 4 }).toBuffer();
    } else if (format === "jpeg") {
      buf = await pipeline
        .clone()
        .flatten({ background: "#eef4fb" })
        .jpeg({ quality: q, mozjpeg: true })
        .toBuffer();
    } else {
      buf = await pipeline.clone().webp({ quality: q, effort: 4 }).toBuffer();
    }
    if (buf.length <= maxBytes || q <= 20) return { buf, quality: q, bytes: buf.length };
    quality -= 8;
  }
  return { buf, quality, bytes: buf.length };
}

async function processOne(file) {
  const ext = path.extname(file).toLowerCase();
  if (!INPUT_EXT.has(ext)) return null;

  const base = slugify(file);
  const isHero = heroesAll || (heroFile && path.basename(file) === heroFile);
  const maxBytes = isHero ? HERO_MAX_BYTES : BODY_MAX_BYTES;
  const src = path.join(inputDir, file);
  const image = sharp(src, { animated: false });
  const meta = await image.metadata();
  const origW = meta.width || 1600;

  await fs.mkdir(optPublicDir, { recursive: true });

  const results = [];
  for (const w of WIDTHS) {
    const width = Math.min(w, origW);
    const resized = image.clone().resize({ width, withoutEnlargement: true });
    const avif = await encodeToBudget(resized, "avif", maxBytes, startAvif);
    const webp = await encodeToBudget(resized, "webp", maxBytes, startWebp);
    const avifName = `${base}-${width}.avif`;
    const webpName = `${base}-${width}.webp`;
    await fs.writeFile(path.join(outputDir, avifName), avif.buf);
    await fs.writeFile(path.join(outputDir, webpName), webp.buf);
    await fs.writeFile(path.join(optPublicDir, avifName), avif.buf);
    await fs.writeFile(path.join(optPublicDir, webpName), webp.buf);
    results.push({
      width,
      avif: avifName,
      webp: webpName,
      avifKb: +(avif.bytes / 1024).toFixed(1),
      webpKb: +(webp.bytes / 1024).toFixed(1),
      overBudget: avif.bytes > maxBytes || webp.bytes > maxBytes,
    });
    if (width === origW) break;
  }

  const canonical = results.find((r) => r.width === 1200) || results[results.length - 1];
  const jpegPipe = image.clone().resize({
    width: canonical.width,
    withoutEnlargement: true,
  });
  const jpeg = await encodeToBudget(jpegPipe, "jpeg", maxBytes, startJpeg);
  const jpegName = `${base}-${canonical.width}.jpg`;
  await fs.writeFile(path.join(outputDir, jpegName), jpeg.buf);
  await fs.writeFile(path.join(optPublicDir, jpegName), jpeg.buf);

  await fs.mkdir(publicDir, { recursive: true });
  await fs.copyFile(
    path.join(outputDir, canonical.webp),
    path.join(publicDir, `${base}.webp`),
  );

  return {
    original: file,
    base,
    publicPath: `/images/cs/ai-services/${base}.webp`,
    fallback: jpegName,
    fallbackKb: +(jpeg.bytes / 1024).toFixed(1),
    hero: isHero,
    width: origW,
    height: meta.height || null,
    outputs: results,
  };
}

async function main() {
  if (process.argv.includes("--help")) {
    console.log(
      "node scripts/optimize-images.mjs --input ./images --output ./optimized --heroes-all --batch",
    );
    process.exit(0);
  }

  await fs.mkdir(outputDir, { recursive: true });
  const files = (await fs.readdir(inputDir)).sort();
  const manifest = [];

  for (const file of files) {
    const stat = await fs.stat(path.join(inputDir, file));
    if (!stat.isFile()) continue;
    if (batchOnly && !BATCH.has(file)) continue;
    const row = await processOne(file);
    if (row) {
      manifest.push(row);
      const flag = row.outputs.some((o) => o.overBudget) ? " OVER BUDGET" : "";
      console.log(
        `${row.original} -> ${row.base} ${row.width}x${row.height} (${row.hero ? "hero" : "lazy"})${flag}`,
      );
    }
  }

  await fs.writeFile(
    path.join(outputDir, "manifest.json"),
    JSON.stringify({ generatedAt: new Date().toISOString(), images: manifest }, null, 2),
  );
  console.log(`Wrote ${manifest.length} images to ${outputDir} and ${publicDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
