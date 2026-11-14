import { test, expect } from "@playwright/test";
import { ogLocales, translate, useTranslations } from "../src/i18n";
import settings from "../src/site.config.json" with { type: "json" };

const language = "ja";
const t = useTranslations(language);

test("Home introduces the journal and highlights the latest story", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".oq-home")).toBeVisible();
  await expect(page.locator(".hero h1")).toContainText(t("hero.title"));
  await expect(page.locator(".feature-card")).toContainText("OQVETAを公開しました");
  await expect(page.locator(".latest-section")).toBeVisible();
  await expect(page.locator(".feature-card")).toHaveAttribute("href", /\/posts\//);
});

test("Release archive, tags, month filter, and empty state", async ({ page }) => {
  await page.goto("/posts/?tag=リリース");
  await expect(page.locator(".post-card")).toHaveCount(1);
  await page.goto("/posts/?month=2026-11");
  await expect(page.locator(".post-card")).toHaveCount(1);
  await page.goto("/posts/?category=missing");
  await expect(page.getByText(t("post.emptyTitle"))).toBeVisible();
});

test("Search finds the launch release", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: t("nav.search"), exact: true }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await page.getByRole("searchbox", { name: t("search.keywords") }).fill("公開しました");
  await expect(dialog.locator(".search-result")).toHaveCount(1);
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
});

test("Release article content and reading progress", async ({ page, isMobile }) => {
  await page.goto("/posts/2026-11-13-launch/");
  await expect(page.locator(".article-header h1")).toContainText("OQVETAを公開しました");
  await expect(page.locator("#article-body h2")).toHaveCount(2);
  await expect(page.locator("#article-body h3")).toHaveCount(4);
  if (isMobile) {
    await page.locator(".mobile-toc summary").click();
    await page.locator(".mobile-toc a").last().click();
  } else {
    await page.locator(".toc a").last().click();
  }
  await expect(page).toHaveURL(/#/);
  await expect(page.locator("#reading-progress")).not.toHaveAttribute("style", "width: 0%;");
});

test("Theme persistence across reloads and pages", async ({ page }) => {
  await page.addInitScript(() => window.localStorage.setItem("theme", "light"));
  await page.goto("/");
  await page.getByRole("button", { name: t("nav.dark") }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.goto("/about/");
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.getByRole("button", { name: t("nav.light") }).click();
  await expect(page.locator("html")).not.toHaveClass(/dark/);
});

test("Page layouts and browser errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const path of ["/", "/posts/", "/projects/", "/about/", "/posts/2026-11-13-launch/"]) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    const size = await page.evaluate(() => ({ width: innerWidth, content: document.documentElement.scrollWidth }));
    expect(size.content, path).toBeLessThanOrEqual(size.width);
  }
  expect(errors).toEqual([]);
});

test("Sitemap, RSS, and 404", async ({ page, request }) => {
  const feed = await request.get("/rss.xml");
  expect(feed.status()).toBe(200);
  expect((await feed.text()).match(/<item>/g)).toHaveLength(1);
  expect((await request.get("/sitemap.xml")).status()).toBe(200);
  expect(await (await request.get("/robots.txt")).text()).toContain("Sitemap:");
  const response = await page.goto("/a-page-that-does-not-exist/");
  expect(response?.status()).toBe(404);
  await expect(page.getByText(t("error.heading"))).toBeVisible();
});

test("SEO metadata and RSS consistency", async ({ page, request }) => {
  await page.goto("/posts/2026-11-13-launch/?tracking=example#article-body");
  const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
  expect(canonical).toMatch(/\/posts\/2026-11-13-launch\/$/);
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", canonical!);
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "article");
  await expect(page.locator('meta[property="article:published_time"]')).toHaveAttribute("content", "2026-11-13T00:00:00.000Z");
  const sitemap = await request.get("/sitemap-0.xml");
  expect(sitemap.status()).toBe(200);
  expect(await sitemap.text()).toContain(canonical);
  const rss = await request.get("/rss.xml");
  expect((await rss.text()).match(/<item>/g)).toHaveLength(1);
});

test("Japanese default language, metadata, and modern font stack", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", language);
  await expect(page).toHaveTitle(`${t("nav.home")} · ${settings.site.name}`);
  await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute("content", ogLocales[language]);
  await expect(page.locator("h1")).toHaveText(t("hero.title"));
  const family = await page.locator("body").evaluate((el) => getComputedStyle(el).fontFamily);
  expect(family).toContain("Noto Sans JP");
  await page.goto("/posts/2026-11-13-launch/");
  const feed = await (await page.request.get("/rss.xml")).text();
  expect(feed).toContain("<language>ja</language>");
});

test("English home route and language switch", async ({ page, request }) => {
  const en = (key: Parameters<typeof t>[0]) => translate("en", key);
  await page.goto("/");
  await page.getByRole("link", { name: t("nav.language") }).click();
  await expect(page).toHaveURL(/\/en\/$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.getByRole("link", { name: en("nav.language") }).click();
  await expect(page).toHaveURL("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "ja");
  const feed = await (await request.get("/en/rss.xml")).text();
  expect(feed).toContain("<language>en</language>");
});

test("Structured data and profile page", async ({ page }) => {
  await page.goto("/posts/2026-11-13-launch/");
  const { "@graph": graph } = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) as string);
  const byType = (type: string) => graph.find((item: { "@type": string }) => item["@type"] === type);
  const post = byType("BlogPosting");
  expect(post.headline).toContain("OQVETAを公開");
  expect(post.datePublished).toBe("2026-11-13T00:00:00.000Z");
  expect(post.inLanguage).toBe("ja");
  expect(byType("Person").jobTitle).toBe("匿名の個人ブログ");
  await page.goto("/about/");
  expect(page.url()).toContain("/about/");
});
