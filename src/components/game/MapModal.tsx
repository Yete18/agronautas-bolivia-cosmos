import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DEPARTMENTS } from "@/data/departments";

interface MapModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentDepartment: string;
  onSelectDepartment: (departmentId: string) => void;
}

export const MapModal = ({
  open,
  onOpenChange,
  currentDepartment,
  onSelectDepartment,
}: MapModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl neon-border bg-card">
        <DialogHeader>
          <DialogTitle className="text-2xl neon-glow">
            🗺️ Mapa de Bolivia
          </DialogTitle>
        </DialogHeader>

        <div className="relative w-full h-[500px] bg-muted/30 rounded-lg overflow-hidden">
          {/* SVG Map of Bolivia */}
          <svg
            viewBox="0 0 600 600"
            className="w-full h-full"
            style={{ filter: "drop-shadow(0 0 10px hsl(var(--neon-cyan) / 0.3))" }}
          >
            {/* Bolivia outline (simplified) */}
            <path
              d="M 100 100 L 500 100 L 500 500 L 100 500 Z"
              fill="hsl(var(--muted))"
              stroke="hsl(var(--neon-cyan))"
              strokeWidth="2"
              opacity="0.3"
            />

            {/* Department markers */}
            {DEPARTMENTS.map((dept) => {
              const isCurrent = dept.id === currentDepartment;
              return (
                <g key={dept.id}>
                  <circle
                    cx={dept.position.x}
                    cy={dept.position.y}
                    r={isCurrent ? 20 : 15}
                    fill={
                      isCurrent
                        ? "hsl(var(--neon-cyan))"
                        : "hsl(var(--space-purple))"
                    }
                    stroke="hsl(var(--foreground))"
                    strokeWidth="2"
                    className="cursor-pointer hover:scale-110 transition-transform"
                    onClick={() => {
                      onSelectDepartment(dept.id);
                      onOpenChange(false);
                    }}
                    style={{
                      filter: isCurrent
                        ? "drop-shadow(0 0 10px hsl(var(--neon-cyan)))"
                        : "none",
                    }}
                  />
                  <text
                    x={dept.position.x}
                    y={dept.position.y + 35}
                    textAnchor="middle"
                    fill="hsl(var(--foreground))"
                    fontSize="14"
                    fontWeight={isCurrent ? "bold" : "normal"}
                    className="pointer-events-none"
                  >
                    {dept.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {DEPARTMENTS.map((dept) => {
            const isCurrent = dept.id === currentDepartment;
            return (
              <Button
                key={dept.id}
                variant={isCurrent ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  onSelectDepartment(dept.id);
                  onOpenChange(false);
                }}
                className={isCurrent ? "neon-border" : ""}
              >
                {dept.name}
              </Button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};
