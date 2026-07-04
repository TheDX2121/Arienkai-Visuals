import Parser from "rss-parser";

const parser = new Parser();

const feeds = [
  "https://www.animenewsnetwork.com/all/rss.xml",
  "https://www.crunchyroll.com/newsrss"
];

export async function fetchAnimeNews() {
  const settled = await Promise.allSettled(
    feeds.map(async (feed) => {
      const parsed = await parser.parseURL(feed);
      return parsed.items.slice(0, 5).map((item) => ({
        title: item.title ?? "Untitled anime update",
        source: parsed.title ?? feed,
        url: item.link ?? "#",
        publishedAt: item.pubDate ?? new Date().toISOString(),
        summary: item.contentSnippet ?? ""
      }));
    })
  );

  const news = settled.flatMap((result) => result.status === "fulfilled" ? result.value : []);
  return news.length ? news : fallbackNews;
}

const fallbackNews = [
  {
    title: "Anime news feed temporarily unavailable",
    source: "Arienkai fallback",
    url: "#",
    publishedAt: new Date().toISOString(),
    summary: "The RSS integration is ready, but the upstream feed could not be reached from this environment."
  }
];
