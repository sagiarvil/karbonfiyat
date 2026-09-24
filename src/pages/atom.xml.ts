import { feedItems, siteMetadata } from "../data/feed-items";

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      case '"': return "&quot;";
      default: return c;
    }
  });
}

export async function GET() {
  const updated = new Date().toISOString();

  const entriesXml = feedItems
    .map((item) => {
      const itemUrl = `${siteMetadata.siteUrl}${item.slug}`;
      const entryUpdated = new Date(item.pubDate).toISOString();
      return `  <entry>
    <title>${escapeXml(item.title)}</title>
    <link rel="alternate" type="text/html" href="${itemUrl}" />
    <id>${itemUrl}</id>
    <updated>${entryUpdated}</updated>
    <summary>${escapeXml(item.description)}</summary>
    <category term="${escapeXml(item.category)}" />
    <author>
      <name>${escapeXml(siteMetadata.author)}</name>
    </author>
  </entry>`;
    })
    .join("\n");

  const atom = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(siteMetadata.title)}</title>
  <subtitle>${escapeXml(siteMetadata.description)}</subtitle>
  <link rel="self" type="application/atom+xml" href="${siteMetadata.siteUrl}/atom.xml" />
  <link rel="alternate" type="text/html" href="${siteMetadata.siteUrl}/" />
  <id>${siteMetadata.siteUrl}/</id>
  <updated>${updated}</updated>
  <author>
    <name>${escapeXml(siteMetadata.author)}</name>
    <email>${escapeXml(siteMetadata.authorEmail)}</email>
  </author>
${entriesXml}
</feed>`;

  return new Response(atom, {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600"
    }
  });
}
