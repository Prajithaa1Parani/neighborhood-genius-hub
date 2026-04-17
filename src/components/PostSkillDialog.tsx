import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useExchanges } from "@/lib/exchanges-context";
import { categories } from "@/lib/mock-data";
import { toast } from "sonner";
import { Plus } from "lucide-react";

interface Props {
  trigger?: React.ReactNode;
}

export function PostSkillDialog({ trigger }: Props) {
  const { postSkill } = useExchanges();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Web Dev");
  const [level, setLevel] = useState<"Beginner" | "Intermediate" | "Advanced" | "Pro">("Intermediate");
  const [duration, setDuration] = useState("60 min");
  const [tags, setTags] = useState("");
  const [isFree, setIsFree] = useState(true);
  const [price, setPrice] = useState("500");

  const reset = () => {
    setTitle(""); setDescription(""); setCategory("Web Dev");
    setLevel("Intermediate"); setDuration("60 min"); setTags("");
    setIsFree(true); setPrice("500");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    postSkill({
      title: title.trim(),
      description: description.trim(),
      category,
      level,
      duration,
      tags: tags.split(",").map(t => t.trim()).filter(Boolean).slice(0, 4),
      pricePerHour: isFree ? 0 : Math.max(0, parseInt(price, 10) || 0),
    });
    toast.success("Skill posted to the marketplace");
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button>
            <Plus className="h-4 w-4" /> Post a Skill
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Post a new skill</DialogTitle>
          <DialogDescription>Share what you can teach. Choose to swap for free or set an hourly price.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Concurrency in Go" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.filter(c => c !== "All").map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Level</Label>
              <Select value={level} onValueChange={(v) => setLevel(v as typeof level)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Beginner", "Intermediate", "Advanced", "Pro"].map(l => (
                    <SelectItem key={l} value={l}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="duration">Session length</Label>
            <Input id="duration" value={duration} onChange={e => setDuration(e.target.value)} placeholder="60 min" />
          </div>

          <div className="rounded-lg border border-border bg-muted/30 p-3">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm">Free skill swap</Label>
                <p className="text-[11px] text-muted-foreground">Trade this skill for one of theirs — no money involved.</p>
              </div>
              <Switch checked={isFree} onCheckedChange={setIsFree} />
            </div>
            {!isFree && (
              <div className="mt-3 space-y-1.5">
                <Label htmlFor="price">Hourly price (₹)</Label>
                <Input id="price" type="number" min={0} value={price} onChange={e => setPrice(e.target.value)} placeholder="800" />
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input id="tags" value={tags} onChange={e => setTags(e.target.value)} placeholder="Go, Goroutines, Channels" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="What will the learner walk away with?" required />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">Post Skill</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
