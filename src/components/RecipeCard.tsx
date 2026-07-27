import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { useState } from "react";

interface RecipeCardProps {
    title: string;
    time: number;
    image?: string;
    tags: string[];
}

export function RecipeCard({ title, time, image, tags }: RecipeCardProps) {
    // State to track if the image failed to load
    const [imgError, setImgError] = useState(false);

    // Build the placeholder URL with the recipe title as text
    const placeholderImage = `https://placehold.co/600x400/e2e8f0/475569?text=${encodeURIComponent(title)}`;

    // Use placeholder if image is not provided or if it failed to load
    const imageSrc = image && !imgError ? image : placeholderImage;

    // Logging for debugging
    console.log(`[RecipeCard] ${title}:`, {
        providedImage: image,
        usingPlaceholder: !image || imgError,
        finalSrc: imageSrc,
    });

    return (
        <Card className="group overflow-hidden border-border/50 transition-all duration-200 hover:shadow-md hover:-translate-y-1">
            <div className="aspect-video overflow-hidden bg-muted/30">
                <img
                    src={imageSrc}
                    alt={title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    onError={() => {
                        console.warn(`[RecipeCard] Failed to load image for "${title}":`, image);
                        setImgError(true);
                    }}
                />
            </div>

            <CardHeader className="px-4 pt-4 pb-0">
                <CardTitle className="text-base font-medium leading-tight tracking-tight">
                    {title}
                </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-wrap items-center gap-1.5 px-4 py-3">
                {tags.map((tag) => (
                    <Badge
                        key={tag}
                        variant="secondary"
                        className="text-[10px] font-normal uppercase tracking-wider text-muted-foreground"
                    >
                        {tag}
                    </Badge>
                ))}
                <div className="ml-auto flex items-center text-xs text-muted-foreground">
                    <Clock className="mr-1 size-3.5" strokeWidth={1.5} />
                    <span>{time} min</span>
                </div>
            </CardContent>
        </Card>
    );
}