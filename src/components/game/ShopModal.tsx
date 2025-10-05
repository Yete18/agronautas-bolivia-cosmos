import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Droplet, Sparkles, ShoppingCart } from "lucide-react";

interface ShopModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coins: number;
  onPurchase: (item: "water" | "fertilizer") => void;
}

const SHOP_ITEMS = [
  {
    id: "water" as const,
    name: "Agua (x10)",
    icon: <Droplet className="w-8 h-8" />,
    price: 5,
    color: "text-[hsl(var(--neon-cyan))]",
  },
  {
    id: "fertilizer" as const,
    name: "Fertilizante (x5)",
    icon: <Sparkles className="w-8 h-8" />,
    price: 10,
    color: "text-[hsl(var(--neon-green))]",
  },
];

export const ShopModal = ({ open, onOpenChange, coins, onPurchase }: ShopModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md neon-border bg-card">
        <DialogHeader>
          <DialogTitle className="text-2xl neon-glow flex items-center gap-2">
            <ShoppingCart className="w-6 h-6" />
            Tienda Espacial
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-muted/50 rounded p-3 text-center">
            <div className="text-sm text-muted-foreground mb-1">Tus Monedas</div>
            <div className="text-3xl font-bold neon-glow">🪙 {coins}</div>
          </div>

          <div className="space-y-3">
            {SHOP_ITEMS.map((item) => {
              const canAfford = coins >= item.price;
              return (
                <div
                  key={item.id}
                  className="neon-border rounded-lg p-4 bg-muted/30 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className={item.color}>{item.icon}</div>
                    <div>
                      <div className="font-semibold">{item.name}</div>
                      <div className="text-sm text-muted-foreground">
                        🪙 {item.price} monedas
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => onPurchase(item.id)}
                    disabled={!canAfford}
                    size="sm"
                    className={canAfford ? "" : "opacity-50"}
                  >
                    Comprar
                  </Button>
                </div>
              );
            })}
          </div>

          <div className="text-xs text-center text-muted-foreground">
            💡 Consigue más monedas cosechando plantas
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
