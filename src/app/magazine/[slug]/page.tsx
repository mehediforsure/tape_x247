import { notFound } from "next/navigation";
import Article from "@/components/editorial/Article";
import { getArticle, getArticles } from "@/lib/content/queries";
// Retry optional related-artist content after a transient archive outage.
export const revalidate = 60;
export const generateStaticParams = () => getArticles().map(d => ({ slug: d.slug }));
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
 const article = getArticle((await params).slug);
 return { title: article ? `${article.title} | tape_x247` : "Article not found | tape_x247" };
}
export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
 const article = getArticle((await params).slug);
 if (!article) notFound();
 return <Article lead={article} />;
}
