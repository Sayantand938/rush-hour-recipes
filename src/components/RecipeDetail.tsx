import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, LoaderCircle } from 'lucide-react'; // 👈 Added LoaderCircle

export function RecipeDetail() {
    const { slug } = useParams<{ slug: string }>();
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug) return;
        fetch(`/recipes/${slug}.md`)
            .then((res) => {
                if (!res.ok) throw new Error('Recipe not found');
                return res.text();
            })
            .then((text) => {
                const stripped = text.replace(/---[\s\S]*?---/, '');
                setContent(stripped);
                setLoading(false);
            })
            .catch(() => {
                setContent('Recipe not found.');
                setLoading(false);
            });
    }, [slug]);

    if (loading) {
        return (
            <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
                <LoaderCircle className="size-8 animate-spin text-muted-foreground" strokeWidth={1.5} />
                <p className="text-sm text-muted-foreground">Loading recipe...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-3xl p-4">
            <Link to="/" className="inline-flex items-center text-muted-foreground hover:underline">
                <ArrowLeft className="mr-1 size-4" /> Back to all recipes
            </Link>
            <article className="prose prose-neutral dark:prose-invert mt-4 max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            </article>
        </div>
    );
}