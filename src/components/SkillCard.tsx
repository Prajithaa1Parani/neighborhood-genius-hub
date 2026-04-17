import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Clock, ArrowRight, UserRound, IndianRupee } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useExchanges } from "@/lib/exchanges-context";
import { mentorSlug } from "@/lib/mock-data";
import { toast } from "sonner";
import type { Skill } from "@/lib/mock-data";

const levelTone: Record<Skill["level"], string> = {
  Beginner: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Intermediate: "bg-blue-50 text-blue-700 border border-blue-200",
  Advanced: "bg-violet-50 text-violet-700 border border-violet-200",
  Pro: "bg-amber-50 text-amber-700 border border-amber-200",
};

export function SkillCard({ skill }: { skill: Skill }) {
  const { requestExchange } = useExchanges();
  const mid = mentorSlug(skill.instructor.name);

  const handleRequest = () => {
    requestExchange(skill);
    toast.success(`Exchange requested with ${skill.instructor.name}`, {
      description: skill.title,
    });
  };

  return (
    <Card className="overflow-hidden border-border bg-card transition-shadow hover:shadow-md">
      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        <img
          src={skill.image}
          alt={skill.title}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <span className={`absolute left-3 top-3 rounded-md px-2 py-0.5 text-[11px] font-semibold ${levelTone[skill.level]}`}>
          {skill.level}
        </span>
        <span className="absolute right-3 top-3 rounded-md border border-border bg-card/95 px-2 py-0.5 text-[11px] font-semibold text-foreground shadow-sm">
          {skill.pricePerHour === 0 ? "Free swap" : `₹${skill.pricePerHour}/hr`}
        </span>
      </div>

      <CardContent className="space-y-3 p-5">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-semibold leading-snug text-foreground">{skill.title}</h3>
            <div className="flex shrink-0 items-center gap-1 text-sm">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="font-medium text-foreground">{skill.rating}</span>
              <span className="text-xs text-muted-foreground">({skill.reviewCount})</span>
            </div>
          </div>
          <Link
            to="/mentor/$mentorId"
            params={{ mentorId: mid }}
            className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground hover:text-primary"
          >
            <img src={skill.instructor.avatar} alt={skill.instructor.name} className="h-5 w-5 rounded-full object-cover" />
            <span className="font-medium text-foreground hover:text-primary">{skill.instructor.name}</span>
            <span>·</span>
            <span>{skill.category}</span>
          </Link>
        </div>

        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{skill.description}</p>

        <div className="flex flex-wrap gap-1.5">
          {skill.tags.slice(0, 3).map(tag => (
            <Badge key={tag} variant="secondary" className="rounded-md text-[10px] font-medium">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {skill.distance}</span>
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {skill.duration}</span>
          {skill.pricePerHour > 0 && (
            <span className="flex items-center gap-0.5 font-medium text-foreground">
              <IndianRupee className="h-3 w-3" />{skill.pricePerHour}/hr
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <Button asChild variant="outline" size="icon" aria-label={`View ${skill.instructor.name}'s profile`} title="View mentor profile">
            <Link to="/mentor/$mentorId" params={{ mentorId: mid }}>
              <UserRound className="h-4 w-4" />
            </Link>
          </Button>
          <Button onClick={handleRequest} className="flex-1">
            Request Exchange <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
