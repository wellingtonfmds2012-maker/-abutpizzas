import { useState } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatBRL, type Product } from "@/data/menu";
import { useCart } from "@/lib/cart";

export function QtyControl({ value, onChange, min = 1 }: { value: number; onChange: (v: number) => void; min?: number }) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-muted p-1">
      <Button variant="qty" size="icon" aria-label="Diminuir" onClick={() => onChange(Math.max(min, value - 1))}>
        <Minus />
      </Button>
      <span className="w-6 text-center font-bold tabular-nums">{value}</span>
      <Button variant="qty" size="icon" aria-label="Aumentar" onClick={() => onChange(value + 1)}>
        <Plus />
      </Button>
    </div>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const [pulse, setPulse] = useState(false);
  const { add } = useCart();

  const handleAdd = () => {
    add(product.id, qty);
    toast.success(`${qty}x ${product.name} adicionado!`);
    setPulse(true);
    setTimeout(() => setPulse(false), 400);
    setQty(1);
  };

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/50">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={product.image} alt={product.name} loading="lazy" width={816} height={816}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <span className="absolute bottom-3 left-3 rounded-full bg-background/85 px-3 py-1 text-lg font-extrabold text-primary backdrop-blur">
          {formatBRL(product.price)}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-xl font-bold">{product.name}</h3>
        <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{product.description}</p>
        <div className="flex items-center justify-between gap-3 pt-2">
          <QtyControl value={qty} onChange={setQty} />
          <Button variant="hero" size="lg" onClick={handleAdd} className={`h-11 px-5 ${pulse ? "scale-110" : ""}`}>
            <ShoppingBag /> Adicionar
          </Button>
        </div>
      </div>
    </article>
  );
}
