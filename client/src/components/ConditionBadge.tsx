import { Badge } from "@/components/ui/badge";

type ConditionGrade = "A" | "B" | "C" | "D";

interface ConditionBadgeProps {
  grade: ConditionGrade;
  className?: string;
}

export function ConditionBadge({ grade, className }: ConditionBadgeProps) {
  const getConfig = (grade: ConditionGrade) => {
    const configs = {
      A: { label: "Grade A", description: "Excellent", variant: "default" as const },
      B: { label: "Grade B", description: "Very Good", variant: "default" as const },
      C: { label: "Grade C", description: "Good", variant: "secondary" as const },
      D: { label: "Grade D", description: "Fair", variant: "secondary" as const },
    };
    return configs[grade];
  };

  const config = getConfig(grade);

  return (
    <Badge variant={config.variant} className={className} data-testid={`badge-condition-${grade}`}>
      {config.label}
    </Badge>
  );
}
