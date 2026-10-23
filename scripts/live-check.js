// Live check: opens the URL in a fresh browser context (no cookies, not signed in, like a private window),
// runs every stack from checks/expected-results.md, compares counts and names, tests Clear all,
// reads the build commit from the page footer, and saves screenshots plus live-results.json.
// Usage: node scripts/live-check.js <url> <outDir>
const { chromium } = require("playwright-core");
const fs = require("fs");
const EXPECT = {
  "check-1": { chips: ["Vegetarian", "30 min or less", "$", "$$"], names: ["Bombay Spice House", "Slice & Fire Pizza", "Green Bowl Kitchen", "Casa Oaxaca Taqueria", "Olive & Ember Mezze", "Leafline Salad Co.", "Mumbai Express Kitchen", "Via Roma Pasta Bar", "Barrio Bowls"] },
  "check-2": { chips: ["Vegetarian", "30 min or less", "$", "$$", "4.0+"], names: ["Bombay Spice House", "Slice & Fire Pizza", "Green Bowl Kitchen", "Casa Oaxaca Taqueria", "Olive & Ember Mezze", "Leafline Salad Co.", "Via Roma Pasta Bar", "Barrio Bowls"] },
  "check-3": { chips: ["Vegetarian", "30 min or less"], names: ["Bombay Spice House", "Slice & Fire Pizza", "Green Bowl Kitchen", "Casa Oaxaca Taqueria", "Olive & Ember Mezze", "Rooted Plant Kitchen", "Leafline Salad Co.", "Pad Thai Republic", "Mumbai Express Kitchen", "Via Roma Pasta Bar", "Barrio Bowls"] },
  "check-4": { chips: ["20 min or less", "4.5+", "$"], names: [] },
  "check-5-two-chips": { chips: ["Vegetarian", "Gluten-free"], names: ["Bombay Spice House", "Green Bowl Kitchen", "Bangkok Street Kitchen", "Rooted Plant Kitchen", "Leafline Salad Co.", "Aegean Table", "Barrio Bowls"] },
};
(async () => {
  const [url, outDir] = process.argv.slice(2);
  const browser = await chromium.launch({ channel: "msedge" });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } }); // fresh profile: no cookies, no sign-in
  const p = await ctx.newPage();
  const res = await p.goto(url, { waitUntil: "networkidle" });
  const finalUrl = p.url();
  const first = { status: res.status(), finalUrl, build: await p.getByTestId("build").innerText().catch(() => "n/a"), cards: await p.locator("article").count(), count: await p.getByTestId("count").innerText().catch(() => "n/a"), hasPassword: await p.locator("input[type=password]").count() };
  await p.screenshot({ path: `${outDir}/live-first-load.png`, fullPage: true });
  const navs = []; p.on("framenavigated", (f) => { if (f === p.mainFrame()) navs.push(f.url()); });
  const rows = [];
  for (const [file, s] of Object.entries(EXPECT)) {
    const clear = p.getByRole("button", { name: "Clear all" }).first();
    if (await clear.isVisible()) await clear.click();
    for (const c of s.chips) await p.getByRole("button", { name: c, exact: true }).click();
    const shown = Number((await p.getByTestId("count").innerText()).split(" ")[0]);
    const names = await p.locator("article h2").allInnerTexts();
    const empty = (await p.getByTestId("empty").count()) ? (await p.getByTestId("empty").innerText()).split("\n")[0] : "";
    const row = { file, chips: s.chips, expected: s.names.length, live: shown, namesMatch: JSON.stringify(names) === JSON.stringify(s.names), empty };
    await p.screenshot({ path: `${outDir}/live-${file}.png`, fullPage: true });
    if (file === "check-4") {
      await p.getByTestId("empty").getByRole("button", { name: "Clear all" }).click();
      row.afterClearAll = await p.locator("article").count();
      await p.screenshot({ path: `${outDir}/live-check-4-after-clear-all.png`, fullPage: true });
    }
    rows.push(row);
  }
  const out = { url, first, rows, reloadsDuringClicks: navs.length };
  fs.writeFileSync(`${outDir}/live-results.json`, JSON.stringify(out, null, 2));
  console.log(JSON.stringify(out, null, 1));
  await browser.close();
})();
