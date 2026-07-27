import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { VirtuosoGrid } from 'react-virtuoso';
import { useDebounce } from 'use-debounce';
import { RecipeCard } from './RecipeCard';
import { Zap, Search, LoaderCircle } from 'lucide-react';

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
    const [debouncedQuery] = useDebounce(searchQuery, 300);

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

    // Filter recipes (debounced)
    const filteredRecipes = useMemo(() => {
        if (!debouncedQuery.trim()) return recipes;
        const query = debouncedQuery.toLowerCase().trim();
        return recipes.filter((recipe) => {
            const titleMatch = recipe.title.toLowerCase().includes(query);
            const tagMatch = recipe.tags.some((tag) =>
                tag.toLowerCase().includes(query)
            );
            return titleMatch || tagMatch;
        });
    }, [recipes, debouncedQuery]);

    // Render each item – `_index` is intentionally unused
    const ItemRenderer = useCallback(
        (_index: number, recipe: RecipeMeta) => (
            <Link key={recipe.slug} to={`/recipe/${recipe.slug}`}>
                <RecipeCard {...recipe} />
            </Link>
        ),
        []
    );

    if (loading) {
        return (
            <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
                <LoaderCircle className="size-8 animate-spin text-muted-foreground" strokeWidth={1.5} />
                <p className="text-sm text-muted-foreground">Loading your recipes...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-6xl px-4 py-8">
            {/* Header */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3 border-b border-border/50 pb-2 sm:border-b-0 sm:pb-0">
                    <Zap className="size-7 text-primary" strokeWidth={1.5} />
                    <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                        Rush Hour Recipes
                    </h1>
                </div>
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

            {/* Virtualized Grid with hidden scrollbar */}
            {filteredRecipes.length === 0 ? (
                <div className="flex min-h-[30vh] flex-col items-center justify-center text-center">
                    <p className="text-sm text-muted-foreground">
                        {searchQuery.trim()
                            ? `No recipes found for “${searchQuery.trim()}”`
                            : 'No recipes yet. Add some .md files to public/recipes/'}
                    </p>
                </div>
            ) : (
                <VirtuosoGrid
                    totalCount={filteredRecipes.length}
                    itemContent={(index) => {
                        const recipe = filteredRecipes[index];
                        return ItemRenderer(index, recipe);
                    }}
                    listClassName="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                    className="custom-scrollbar"
                    style={{ height: '70vh' }}
                />
            )}
        </div>
    );
}