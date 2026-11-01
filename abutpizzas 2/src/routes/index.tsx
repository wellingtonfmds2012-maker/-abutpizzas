import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MessageCircle, Pizza, ShoppingBag, MapPin, Clock, Phone } from "lucide-react";
import { Toaster } from "sonner";
import hero from "@/assets/hero.jpg";
import { Button } from "@/components/ui/button";
import { CATEGORIES, PRODUCTS, STORE, formatBRL, type CategoryId } from "@/data/menu";
import { CartProvider, useCart } from "@/lib/cart";
import { ProductCard } from "@/components/menu/ProductCard";
import { Checkout } from "@/components/menu/Checkout";
import { whatsappUrl } from "@/lib/order";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ABUTPIZZAS — Cardápio Digital | O sabor que conquista!" },
      { name: "description", content: "Peça sua pizza artesanal ABUTPIZZAS online e finalize pelo WhatsApp. Tradicionais, especiais, combos e bebidas." },
      { property: "og:title", content: "ABUTPIZZAS — Cardápio Digital" },
      { property: "og:description", content: "Pizzas deliciosas, preparadas especialmente para você. Peça pelo WhatsApp." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <CartProvider>
      <Menu />
    </CartProvider>
  ),
});

function Menu() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<CategoryId>("mais-vendidas");
  const { count, subtotal } = useCart();

  useEffect(() => {
    const obs = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id as CategoryId)),
      { rootMargin: "-40% 0px -55% 0px" },
    );
    CATEGORIES.forEach((c) => { const el = document.getElementById(c.id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  return (
    <div className="min-h-screen pb-28">
      <Toaster theme="dark" position="top-center" richColors />

      <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <a href="#" className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-primary shadow-glow">
              <Pizza className="h-6 w-6 text-primary-foreground" />
            </span>
            <div className="leading-tight">
              <p className="font-display text-xl font-extrabold tracking-tight">ABUT<span className="text-primary">PIZZAS</span></p>
              <p className="text-xs text-muted-foreground">{STORE.slogan}</p>
            </div>
          </a>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-xs font-semibold sm:flex">
              <span className="h-2 w-2 animate-pulse rounded-full bg-success" /> Aberto agora
            </span>
            <Button variant="hero" size="icon" className="relative h-11 w-11" onClick={() => setOpen(true)} aria-label="Carrinho">
              <ShoppingBag className="!size-5" />
              {count > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-foreground px-1 text-xs font-bold text-background">{count}</span>}
            </Button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <img src={hero} alt="Pizza artesanal ABUTPIZZAS" width={1600} height={912} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:py-36">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-muted/80 px-3 py-1.5 text-xs font-semibold sm:hidden">
            <span className="h-2 w-2 animate-pulse rounded-full bg-success" /> Aberto agora
          </span>
          <h1 className="animate-in fade-in slide-in-from-bottom-4 max-w-xl text-4xl font-extrabold leading-[1.05] tracking-tight duration-700 sm:text-6xl">
            Sua fome merece uma <span className="text-gradient">ABUTPIZZA!</span>
          </h1>
          <p className="mt-5 max-w-md text-lg text-muted-foreground">Pizzas deliciosas, preparadas especialmente para você.</p>
          <Button variant="hero" size="xl" className="mt-8" asChild>
            <a href="#cardapio">Ver cardápio</a>
          </Button>
        </div>
      </section>

      <nav id="cardapio" className="sticky top-[69px] z-30 scroll-mt-20 border-b bg-background/90 backdrop-blur-lg">
        <div className="no-scrollbar mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3">
          {CATEGORIES.map((c) => (
            <a key={c.id} href={`#${c.id}`}
              className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${active === c.id ? "bg-gradient-primary text-primary-foreground shadow-glow" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
              {c.label}
            </a>
          ))}
        </div>
      </nav>

      <main className="mx-auto max-w-6xl space-y-16 px-4 py-12">
        {CATEGORIES.map((cat) => (
          <section key={cat.id} id={cat.id} className="scroll-mt-40">
            <h2 className="mb-6 text-3xl font-extrabold tracking-tight">{cat.label}</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {PRODUCTS.filter((p) => p.categories.includes(cat.id)).map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        ))}
        <p className="rounded-2xl border border-primary/30 bg-accent/40 p-4 text-center text-sm text-muted-foreground">
          ⚠️ As imagens dos produtos são meramente ilustrativas. A apresentação real dos produtos pode apresentar pequenas diferenças.
        </p>
      </main>

      <footer className="border-t bg-card">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2">
          <div>
            <p className="font-display text-2xl font-extrabold">ABUT<span className="text-primary">PIZZAS</span></p>
            <p className="mt-1 text-muted-foreground">“{STORE.slogan}”</p>
            <p className="mt-4 text-xs text-muted-foreground">⚠️ Imagens meramente ilustrativas.</p>
          </div>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> {STORE.phoneDisplay}</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> {STORE.address}</li>
            <li className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> {STORE.hours}</li>
            <li>
              <Button variant="whatsapp" asChild className="mt-2 h-11 rounded-full px-5">
                <a href={whatsappUrl("Olá ABUTPIZZAS!")} target="_blank" rel="noreferrer"><MessageCircle /> Fale no WhatsApp</a>
              </Button>
            </li>
          </ul>
        </div>
        <p className="border-t py-5 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} ABUTPIZZAS. Todos os direitos reservados.</p>
      </footer>

      {count > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 p-3 animate-in slide-in-from-bottom-8">
          <div className="mx-auto flex max-w-2xl items-center gap-4 rounded-3xl border bg-card/95 p-3 pl-5 shadow-card backdrop-blur-lg">
            <div className="relative">
              <ShoppingBag className="h-7 w-7 text-primary" />
              <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-xs font-bold text-primary-foreground">{count}</span>
            </div>
            <div className="flex-1 leading-tight">
              <p className="text-xs text-muted-foreground">{count} {count === 1 ? "item" : "itens"}</p>
              <p className="text-lg font-extrabold">{formatBRL(subtotal)}</p>
            </div>
            <Button variant="hero" size="lg" className="h-12 px-6" onClick={() => setOpen(true)}>Ver pedido</Button>
          </div>
        </div>
      )}

      <Checkout open={open} onOpenChange={setOpen} />
    </div>
  );
}
