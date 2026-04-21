import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="flex size-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#ff6a3d,#f4b844)] text-sm font-black tracking-[0.24em] text-white shadow-[0_16px_40px_rgba(255,106,61,0.25)]">
        PX
      </div>
      <div className="flex flex-col">
        <span className="font-heading text-lg font-semibold tracking-tight text-foreground">
          {BRAND.name}
        </span>
        <span className="text-xs text-muted-foreground">
          Structured DSA prep
        </span>
      </div>
    </div>
  );
}
