import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
  onClick?: () => void;
}

export default function GlassCard({ children, className, variant = "primary", onClick }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border overflow-hidden",
        variant === "primary" 
          ? "bg-white/10 dark:bg-black/20 backdrop-blur-xl border-white/20 dark:border-white/10 shadow-2xl"
          : "bg-white/5 dark:bg-black/10 backdrop-blur-lg border-white/10 dark:border-white/5 shadow-xl",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
