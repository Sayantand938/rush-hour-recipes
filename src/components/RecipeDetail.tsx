import { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, LoaderCircle } from 'lucide-react';

type RecipeMeta = {
    slug: string;
    title: string;
    time: number;
    tags: string[];
    image?: string;
    description: string;
};

export function RecipeDetail() {
    const { slug } = useParams<{ slug: string }>();
    const location = useLocation();
    const state = location.state as { recipe?: RecipeMeta } | null;

    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug) {
            setTitle('No recipe specified');
            setContent('Please go back and select a recipe.');
            setLoading(false);
            return;
        }

        const fetchRecipe = async (recipeTitle: string) => {
            try {
                const url = `/recipes/${slug}.md`;
                const res = await fetch(url);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const text = await res.text();
                // Strip frontmatter (assumes it starts with --- at the very beginning)
                const stripped = text.replace(/^---[\s\S]*?---/, '').trim();
                setTitle(recipeTitle);
                setContent(stripped);
                setLoading(false);
            } catch (err) {
                console.error('[RecipeDetail] Error fetching markdown:', err);
                setTitle('Recipe not found');
                setContent('Sorry, the recipe could not be loaded.');
                setLoading(false);
            }
        };

        // If we have recipe from state, use it immediately
        if (state?.recipe && state.recipe.slug === slug) {
            fetchRecipe(state.recipe.title);
            return;
        }

        // Otherwise fetch manifest to get metadata
        fetch('/data/manifest.json')
            .then((res) => {
                if (!res.ok) throw new Error('Manifest not found');
                return res.json();
            })
            .then((manifest: RecipeMeta[]) => {
                const recipe = manifest.find((r) => r.slug === slug);
                if (!recipe) throw new Error('Recipe not found in manifest');
                fetchRecipe(recipe.title);
            })
            .catch(() => {
                // Fallback: use slug as title
                fetchRecipe(slug.replace(/-/g, ' '));
            });
    }, [slug, state]);

    if (loading) {
        return (
            <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
                <LoaderCircle className="size-10 sm:size-8 animate-spin text-muted-foreground" strokeWidth={1.5} />
                <p className="text-sm text-muted-foreground">Loading recipe...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-3xl px-6 sm:px-8 py-3 sm:py-6">
            <Link
                to="/"
                className="inline-flex items-center text-sm sm:text-base text-muted-foreground hover:underline py-2 px-1 -ml-1 touch-manipulation"
            >
                <ArrowLeft className="mr-1 size-4 sm:size-5" /> Back to all recipes
            </Link>

            <h1 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight">
                {title}
            </h1>

            <article
                className="prose prose-neutral dark:prose-invert mt-4 max-w-none
                prose-headings:font-semibold
                prose-h1:text-2xl sm:prose-h1:text-3xl
                prose-h2:text-xl sm:prose-h2:text-2xl
                prose-p:text-base sm:prose-p:text-lg
                prose-li:text-base sm:prose-li:text-lg
                prose-ul:pl-4 sm:prose-ul:pl-6
            "
            >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            </article>
        </div>
    );
}