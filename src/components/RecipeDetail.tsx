import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft } from 'lucide-react';

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

    if (loading) return <div className="p-6 text-center">Loading recipe...</div>;

    return (
        <div className="container mx-auto max-w-3xl p-4">
            <Link to="/" className="inline-flex items-center text-muted-foreground hover:underline">
                <ArrowLeft className="mr-1 size-4" /> Back to all recipes
            </Link>
            {/* 👇 Clean, standard prose classes with dark mode support */}
            <article className="prose prose-neutral dark:prose-invert mt-4 max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            </article>
        </div>
    );
}