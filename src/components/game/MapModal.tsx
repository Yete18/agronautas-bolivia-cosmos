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

        <div className="relative w-full h-[500px] bg-gradient-to-br from-[hsl(var(--muted))] to-[hsl(var(--muted)/0.5)] rounded-lg overflow-hidden">
          {/* SVG Map of Bolivia */}
          <svg
            viewBox="0 0 600 600"
            className="w-full h-full"
            style={{ filter: "drop-shadow(0 0 10px hsl(var(--neon-cyan) / 0.3))" }}
          >
            {/* Bolivia map outline - more realistic shape */}
            <defs>
              <linearGradient id="boliviaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--muted))" stopOpacity="0.6" />
                <stop offset="100%" stopColor="hsl(var(--space-purple))" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            
            {/* Bolivia territory shape (simplified but more realistic) */}
            <path
              d="M 280 50 L 400 80 L 480 150 L 520 240 L 510 350 L 450 450 L 380 520 L 280 550 L 200 520 L 140 450 L 120 350 L 130 250 L 170 150 L 240 80 Z"
              fill="url(#boliviaGradient)"
              stroke="hsl(var(--neon-cyan))"
              strokeWidth="3"
              opacity="0.8"
            />

            {/* Inner borders for visual depth */}
            <path
              d="M 200 200 L 280 180 L 360 200 L 400 260 L 380 340 L 320 400 L 250 380 L 200 320 Z"
              fill="none"
              stroke="hsl(var(--neon-cyan))"
              strokeWidth="1"
              opacity="0.3"
              strokeDasharray="5,5"
            />

            {/* Department markers with enhanced styling */}
            {DEPARTMENTS.map((dept) => {
              const isCurrent = dept.id === currentDepartment;
              return (
                <g key={dept.id}>
                  {/* Glow effect for current department */}
                  {isCurrent && (
                    <circle
                      cx={dept.position.x}
                      cy={dept.position.y}
                      r={30}
                      fill="hsl(var(--neon-cyan))"
                      opacity="0.2"
                      className="animate-glow"
                    />
                  )}
                  
                  {/* Main marker */}
                  <circle
                    cx={dept.position.x}
                    cy={dept.position.y}
                    r={isCurrent ? 18 : 12}
                    fill={
                      isCurrent
                        ? "hsl(var(--neon-cyan))"
                        : "hsl(var(--space-purple))"
                    }
                    stroke="hsl(var(--foreground))"
                    strokeWidth="2"
                    className="cursor-pointer hover:scale-125 transition-all duration-300"
                    onClick={() => {
                      onSelectDepartment(dept.id);
                      onOpenChange(false);
                    }}
                    style={{
                      filter: isCurrent
                        ? "drop-shadow(0 0 15px hsl(var(--neon-cyan)))"
                        : "drop-shadow(0 0 5px hsl(var(--space-purple)/0.5))",
                    }}
                  />
                  
                  {/* Marker icon */}
                  <text
                    x={dept.position.x}
                    y={dept.position.y + 5}
                    textAnchor="middle"
                    fill="hsl(var(--background))"
                    fontSize={isCurrent ? "16" : "12"}
                    fontWeight="bold"
                    className="pointer-events-none"
                  >
                    📍
                  </text>
                  
                  {/* Label */}
                  <text
                    x={dept.position.x}
                    y={dept.position.y + 35}
                    textAnchor="middle"
                    fill="hsl(var(--foreground))"
                    fontSize="13"
                    fontWeight={isCurrent ? "bold" : "normal"}
                    className="pointer-events-none"
                    style={{
                      textShadow: isCurrent ? "0 0 10px hsl(var(--neon-cyan))" : "none",
                    }}
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
