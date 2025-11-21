import { cn } from "@/lib/utils";
import { useCompanyBranding } from "@/hooks/useCompanyBranding";

interface BrandLogoProps {
  className?: string;
  imageClassName?: string;
  showTextFallback?: boolean;
}

export function BrandLogo({ className, imageClassName, showTextFallback = true }: BrandLogoProps) {
  const { logoUrl } = useCompanyBranding();

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {logoUrl ? (
        <img
          src={logoUrl}
          alt="Company logo"
          className={cn("h-9 w-auto max-h-10 object-contain", imageClassName)}
        />
      ) : (
        showTextFallback && (
          <div className="text-lg font-bold tracking-tight">
            <span className="text-primary">SecondHand</span>
            <span className="text-muted-foreground">(Whole)</span>
            <span className="text-primary">Cell</span>
          </div>
        )
      )}
    </div>
  );
}
