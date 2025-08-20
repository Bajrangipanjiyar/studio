import { Package } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-2" aria-label="Washee Home">
      <Package className="h-6 w-6 text-primary" />
      <h1 className="text-xl font-bold text-foreground">Washee</h1>
    </div>
  );
}
