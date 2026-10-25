import HomeView from "@/components/HomeView";
import { countries } from "@/content/taxonomy";
import { getArticles, getArtistsByCountry } from "@/lib/content/queries";
import { toStory } from "@/lib/content/stories";

export default function HomePage() {
  const articles = getArticles();
  const stories = articles.map(toStory);
  const featuredIndex = articles.findIndex(a => a.body.length > 0);
  const lead = stories[featuredIndex < 0 ? 0 : featuredIndex];

  if (!lead) {
    return (
      <div className="wrap py-10">
        <h1 className="headline-xl">A zine. A living archive.</h1>
        <p className="mt-4 text-muted">Stories are on their way.</p>
      </div>
    );
  }

  const side = stories.filter(s => s.href !== lead.href);
  const scenes = countries.map(c => ({ ...c, count: getArtistsByCountry(c.name).length }));

  // "Latest" stays empty until there are more stories than the lead + side list show.
  return <HomeView lead={lead} side={side} latest={[]} scenes={scenes} />;
}
