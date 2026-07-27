import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface RecipeCardProps {
    title: string;
    time: number;
    tags: string[];
    description: string;
}

export function RecipeCard({ title, time, tags, description }: RecipeCardProps) {
    return (
        <Card className="group h-full transition-all duration-200 hover:shadow-md hover:-translate-y-1">
            <CardHeader className="px-4 pt-4 pb-0">
                <CardTitle className="text-base font-medium leading-tight tracking-tight">
                    {title}
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 px-4 py-3">
                {/* Description */}
                <p className="line-clamp-2 text-sm text-muted-foreground">
                    {description}
                </p>

                {/* Tags + Time */}
                <div className="flex flex-wrap items-center gap-1.5">
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
                </div>
            </CardContent>
        </Card>
    );
}