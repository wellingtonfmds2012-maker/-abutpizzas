import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { PRODUCTS, type Product } from "@/data/menu";

type Items = Record<string, number>;
interface CartCtx {
  items: { product: Product; qty: number }[];
  add: (id: string, qty: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  count: number;
  subtotal: number;
}
const Ctx = createContext<CartCtx | null>(null);
const KEY = "abutpizzas-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [raw, setRaw] = useState<Items>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const s = localStorage.getItem(KEY);
      if (s) setRaw(JSON.parse(s));
    } catch {}
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded) localStorage.setItem(KEY, JSON.stringify(raw));
  }, [raw, loaded]);

  const items = Object.entries(raw)
    .map(([id, qty]) => ({ product: PRODUCTS.find((p) => p.id === id)!, qty }))
    .filter((i) => i.product && i.qty > 0);

  const value: CartCtx = {
    items,
    add: (id, qty) => setRaw((r) => ({ ...r, [id]: (r[id] ?? 0) + qty })),
    setQty: (id, qty) =>
      setRaw((r) => {
        const n = { ...r };
        if (qty <= 0) delete n[id];
        else n[id] = qty;
        return n;
      }),
    remove: (id) =>
      setRaw((r) => {
        const n = { ...r };
        delete n[id];
        return n;
      }),
    clear: () => setRaw({}),
    count: items.reduce((s, i) => s + i.qty, 0),
    subtotal: items.reduce((s, i) => s + i.qty * i.product.price, 0),
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart outside provider");
  return c;
}
