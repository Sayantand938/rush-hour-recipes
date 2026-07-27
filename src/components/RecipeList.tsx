import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { RecipeCard } from './RecipeCard';
import { Zap, Search } from 'lucide-react'; // 👈 changed Bolt → Zap

type RecipeMeta = {
    slug: string;
    title: string;
    time: number;
    tags: string[];
    image?: string;
    description: string;
};

export function RecipeList() {
    const [recipes, setRecipes] = useState<RecipeMeta[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch manifest
    useEffect(() => {
        fetch('/data/manifest.json')
            .then((res) => res.json())
            .then((data) => {
                setRecipes(data);
                setLoading(false);
            })
            .catch(() => {
                setRecipes([]);
                setLoading(false);
            });
    }, []);

    // Filter recipes based on search query (title or tags)
    const filteredRecipes = useMemo(() => {
        if (!searchQuery.trim()) return recipes;

        const query = searchQuery.toLowerCase().trim();
        return recipes.filter((recipe) => {
            const titleMatch = recipe.title.toLowerCase().includes(query);
            const tagMatch = recipe.tags.some((tag) =>
                tag.toLowerCase().includes(query)
            );
            return titleMatch || tagMatch;
        });
    }, [recipes, searchQuery]);

    // Loading state
    if (loading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground">
                Loading recipes...
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-6xl px-4 py-8">
            {/* Header */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3 border-b border-border/50 pb-2 sm:border-b-0 sm:pb-0">
                    <Zap className="size-7 text-primary" strokeWidth={1.5} /> {/* 👈 Zap icon */}
                    <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                        Rush Hour Recipes
                    </h1>
                </div>

                {/* Search Bar */}
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search recipes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-4 text-sm outline-none ring-0 transition placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                </div>
            </div>

            {/* Recipe Grid */}
            {filteredRecipes.length === 0 ? (
                <div className="flex min-h-[30vh] flex-col items-center justify-center text-center">
                    <p className="text-sm text-muted-foreground">
                        {searchQuery.trim()
                            ? `No recipes found for “${searchQuery.trim()}”`
                            : 'No recipes yet. Add some .md files to public/recipes/'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredRecipes.map((recipe) => (
                        <Link key={recipe.slug} to={`/recipe/${recipe.slug}`}>
                            <RecipeCard {...recipe} />
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}