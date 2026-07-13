// Generates writing.html — a Miessler-style content index (Title · Date · Atomic Summary · Tags)
// from every markdown file's frontmatter under content/. Platform-proof: add a file, rerun.
import { readdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

const ROOT = import.meta.dir;
const CONTENT = join(ROOT, "content");

// Curated atomic summaries + tags for items whose frontmatter lacks them.
// (Podcasts already carry tags + a body summary; these fill the essays + video.)
const ENRICH: Record<string, { summary: string; tags: string[] }> = {
  "2024-01-03-medicines-shaped-by-profit-and-politics": {
    summary:
      "How industry and politics shaped modern medicine — from Purdue's OxyContin machine and the benzodiazepine surge to the psychedelic renaissance and the cultural debt owed to healers like María Sabina.",
    tags: ["science-policy", "pharmaceuticals", "psychedelics", "ethics"],
  },
  "2023-08-29-reflecting-on-depictions-of-scientists-over-the-centuries": {
    summary:
      "Three centuries of the scientist on screen — from the Mad Scientist of Frankenstein to Shuri and Oppenheimer — and what those portrayals do to public trust in science.",
    tags: ["science-communication", "media", "history-of-science"],
  },
  "2026-02-28-the-world-behind-the-screen": {
    summary:
      "The hidden material debt inside your phone: 30–40 elements, the human and ecological cost of mining lithium and cobalt, and the chemistry of sodium batteries and urban mining that could pay it back.",
    tags: ["materials-science", "sustainability", "critical-minerals", "recycling"],
  },
  "2017-08-05-a-long-and-winding-road": {
    summary:
      "A first-year's plain-language tour through his own research title — self-assembly of magnetic colloids with shifted dipoles — and what it was like to meet science as a stranger.",
    tags: ["materials-science", "self-assembly", "reflection"],
  },
  "2017-07-03-the-best-laid-plans": {
    summary:
      "How the UPR student strike detoured a Puerto Rican undergrad into an improvised New York summer — a short, wry travel story with a guest appearance by Prof. Ilona Kretzschmar.",
    tags: ["puerto-rico", "personal", "research-life"],
  },
  "pr-renewable-microgrids-nmc2025": {
    summary:
      "A short documentary on Puerto Rico's failing fossil-fuel grid and the grassroots cooperatives building reliable renewable microgrids themselves. NMC 2025 science-communication final project.",
    tags: ["puerto-rico", "renewable-energy", "science-communication", "video"],
  },
};

type Item = {
  title: string;
  date: string;
  type: string;
  summary: string;
  tags: string[];
  url: string;
  platform: string;
};

function parseFrontmatter(raw: string): Record<string, string> {
  const m = raw.match(/^---\n([\s\S]*?)\n---/);
  const fm: Record<string, string> = {};
  if (!m) return fm;
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) fm[kv[1]] = kv[2].replace(/^["']|["']$/g, "").trim();
  }
  return fm;
}

function firstParagraph(raw: string): string {
  const body = raw.replace(/^---\n[\s\S]*?\n---\n/, "").trim();
  const para = body.split("\n").find((l) => l.trim() && !l.startsWith(">") && !l.startsWith("#"));
  return (para ?? body.split("\n").find((l) => l.trim().startsWith(">")) ?? "").replace(/^>\s*/, "").slice(0, 240);
}

const TYPE_LABEL: Record<string, string> = {
  podcast: "Podcast",
  video: "Video",
  "": "Essay",
};

const items: Item[] = [];
for (const dir of readdirSync(CONTENT)) {
  const dirPath = join(CONTENT, dir);
  let files: string[];
  try {
    files = readdirSync(dirPath).filter((f) => f.endsWith(".md"));
  } catch {
    continue;
  }
  for (const f of files) {
    const raw = readFileSync(join(dirPath, f), "utf8");
    const fm = parseFrontmatter(raw);
    if (!fm.title) continue;
    const key = f.replace(/\.md$/, "");
    const enrich = ENRICH[key];
    const type = fm.type ?? (dir === "podcasts" ? "podcast" : dir === "media" ? "video" : "");
    items.push({
      title: fm.title,
      date: fm.date ?? "",
      type,
      summary: enrich?.summary ?? firstParagraph(raw),
      tags: enrich?.tags ?? (fm.tags ? fm.tags.replace(/[\[\]]/g, "").split(",").map((s) => s.trim()).filter(Boolean) : []),
      url: fm.source_url ?? fm.video_embed ?? "#",
      platform: fm.platform ?? "",
    });
  }
}

items.sort((a, b) => (a.date < b.date ? 1 : -1));

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const fmtDate = (d: string) =>
  d ? new Date(d + "T00:00:00").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "";

const rows = items
  .map(
    (it) => `      <article class="entry">
        <div class="entry-head">
          <h3 class="entry-title"><a href="${esc(it.url)}" target="_blank" rel="noopener">${esc(it.title)}</a></h3>
          <span class="entry-type">${TYPE_LABEL[it.type] ?? esc(it.type)}</span>
        </div>
        <p class="entry-meta">${fmtDate(it.date)}${it.platform ? " · " + esc(it.platform) : ""}</p>
        <p class="entry-summary">${esc(it.summary)}</p>
        <ul class="entry-tags">${it.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
      </article>`
  )
  .join("\n");

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="Writing, essays, video, and podcasts by Ivan Vega Bellido — science, policy, and philosophy.">
<link rel="canonical" href="https://gvegabellido.com/writing.html">
<link rel="icon" type="image/svg+xml" href="favicon.svg">
<title>Writing · Ivan Vega Bellido</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Inter:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="styles.css">
<style>
  .index-list { max-width: 760px; margin: 0 auto; }
  .entry { padding: 2rem 0; border-bottom: 1px solid rgba(26,26,62,0.12); }
  .entry-head { display: flex; align-items: baseline; justify-content: space-between; gap: 1rem; }
  .entry-title { font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; font-weight: 500; margin: 0; line-height: 1.25; }
  .entry-title a { color: inherit; text-decoration: none; }
  .entry-title a:hover { text-decoration: underline; }
  .entry-type { font-family: 'Inter', sans-serif; font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase; opacity: 0.55; white-space: nowrap; }
  .entry-meta { font-family: 'Inter', sans-serif; font-size: 0.8rem; opacity: 0.6; margin: 0.35rem 0 0.6rem; }
  .entry-summary { font-size: 1rem; line-height: 1.6; margin: 0 0 0.75rem; }
  .entry-tags { list-style: none; display: flex; flex-wrap: wrap; gap: 0.5rem; padding: 0; margin: 0; }
  .entry-tags li { font-family: 'Inter', sans-serif; font-size: 0.7rem; letter-spacing: 0.03em; padding: 0.2rem 0.6rem; border: 1px solid rgba(26,26,62,0.2); border-radius: 999px; opacity: 0.75; }
</style>
</head>
<body>
<nav class="nav">
  <div class="nav-inner">
    <a href="index.html#top" class="nav-brand">IVB</a>
    <ul class="nav-links">
      <li><a href="index.html#about">About</a></li>
      <li><a href="index.html#research">Research</a></li>
      <li><a href="index.html#telos">Telos</a></li>
      <li><a href="writing.html">Writing</a></li>
      <li><a href="index.html#contact">Contact</a></li>
    </ul>
  </div>
</nav>
<main id="top">
<section class="section">
  <div class="container">
    <div class="section-head">
      <span class="section-num">04</span>
      <h2 class="section-title">Writing &amp; Media</h2>
      <span class="section-rule" aria-hidden="true"></span>
    </div>
    <div class="writing-intro">
      <p>Essays, video, and podcasts at the intersection of science, policy, and philosophy. Original sources linked; archived here so they outlast the platforms that hosted them.</p>
    </div>
    <div class="index-list">
${rows}
    </div>
  </div>
</section>
<footer class="footer">
  <div class="container">
    <p class="footer-quote"><em>As above, so below; as within, so without.</em></p>
    <p class="footer-meta">© <span id="year">2026</span> Ivan Vega Bellido</p>
  </div>
</footer>
</main>
<script src="script.js"></script>
</body>
</html>
`;

writeFileSync(join(ROOT, "writing.html"), html);
console.log(`✓ writing.html generated — ${items.length} items`);
for (const it of items) console.log(`  ${it.date}  [${TYPE_LABEL[it.type] ?? it.type}]  ${it.title.slice(0, 60)}`);
