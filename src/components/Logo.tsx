import { Package } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-2" aria-label="OrderVista Home">
      <Package className="h-6 w-6 text-primary" />
      <h1 className="text-xl font-bold text-foreground">OrderVista</h1>
    </div>
  );
}
