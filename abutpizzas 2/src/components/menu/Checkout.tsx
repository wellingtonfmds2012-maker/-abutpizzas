import { useEffect, useState } from "react";
import { Banknote, CreditCard, Loader2, QrCode, Trash2, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { formatBRL, STORE } from "@/data/menu";
import { useCart } from "@/lib/cart";
import { QtyControl } from "./ProductCard";
import {
  buildMessage, calcSubtotal, calcTotal, validateOrder, whatsappUrl,
  type Customer, type PaymentMethod,
} from "@/lib/order";

const empty: Customer = { name: "", cep: "", street: "", number: "", complement: "", district: "", city: "", notes: "" };

export function Checkout({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { items, setQty, remove } = useCart();
  const [c, setC] = useState<Customer>(empty);
  const [payment, setPayment] = useState<PaymentMethod | null>(null);
  const [change, setChange] = useState("");
  const [cepState, setCepState] = useState<"idle" | "loading" | "error">("idle");

  const lines = items.map((i) => ({ name: i.product.name, price: i.product.price, qty: i.qty }));
  const subtotal = calcSubtotal(lines);
  const total = calcTotal(lines);
  const set = (k: keyof Customer) => (e: { target: { value: string } }) => setC((p) => ({ ...p, [k]: e.target.value }));

  useEffect(() => {
    const digits = c.cep.replace(/\D/g, "");
    if (digits.length !== 8) { setCepState("idle"); return; }
    let cancel = false;
    setCepState("loading");
    fetch(`https://viacep.com.br/ws/${digits}/json/`)
      .then((r) => r.json())
      .then((d) => {
        if (cancel) return;
        if (d.erro) { setCepState("error"); return; }
        setC((p) => ({ ...p, street: d.logradouro || p.street, district: d.bairro || p.district, city: d.localidade ? `${d.localidade} - ${d.uf}` : p.city }));
        setCepState("idle");
      })
      .catch(() => !cancel && setCepState("error"));
    return () => { cancel = true; };
  }, [c.cep]);

  const formatCep = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 8);
    return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
  };

  const submit = () => {
    const err = validateOrder(lines, c, payment, change);
    if (err) { toast.error(err); return; }
    // URL gerada somente após validar todos os campos obrigatórios.
    const url = whatsappUrl(buildMessage(lines, c, payment!, change));
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const payOpts: { id: PaymentMethod; label: string; icon: typeof QrCode }[] = [
    { id: "pix", label: "PIX", icon: QrCode },
    { id: "cartao", label: "Cartão", icon: CreditCard },
    { id: "dinheiro", label: "Dinheiro", icon: Banknote },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto border-l bg-background p-0 sm:max-w-lg">
        <SheetHeader className="sticky top-0 z-10 border-b bg-background/95 p-5 backdrop-blur">
          <SheetTitle className="font-display text-2xl">Seu pedido</SheetTitle>
          <SheetDescription>Revise e finalize pelo WhatsApp.</SheetDescription>
        </SheetHeader>

        <div className="space-y-8 p-5">
          <section className="space-y-3">
            {items.length === 0 && <p className="rounded-2xl bg-card p-6 text-center text-muted-foreground">Seu carrinho está vazio.</p>}
            {items.map(({ product, qty }) => (
              <div key={product.id} className="flex gap-3 rounded-2xl bg-card p-3">
                <img src={product.image} alt="" className="h-20 w-20 rounded-xl object-cover" loading="lazy" />
                <div className="flex flex-1 flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-bold leading-tight">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{formatBRL(product.price)} un.</p>
                    </div>
                    <Button variant="ghost" size="icon" aria-label="Remover" onClick={() => remove(product.id)}>
                      <Trash2 className="text-destructive" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <QtyControl value={qty} onChange={(v) => setQty(product.id, v)} />
                    <span className="font-bold text-primary">{formatBRL(product.price * qty)}</span>
                  </div>
                </div>
              </div>
            ))}
          </section>

          <section className="space-y-2 rounded-2xl border bg-card p-5">
            <Row label="Subtotal" value={formatBRL(subtotal)} />
            <Row label="Taxa de entrega" value={formatBRL(items.length ? STORE.deliveryFee : 0)} />
            <div className="mt-3 flex items-center justify-between border-t pt-3">
              <span className="text-lg font-bold">Total</span>
              <span className="text-gradient font-display text-3xl font-extrabold">{formatBRL(total)}</span>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-bold">Forma de pagamento</h3>
            <div className="grid grid-cols-3 gap-2">
              {payOpts.map((o) => (
                <button key={o.id} type="button" onClick={() => setPayment(o.id)}
                  className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-4 text-sm font-semibold transition-all ${payment === o.id ? "border-primary bg-accent text-primary" : "border-border bg-card hover:border-primary/40"}`}>
                  <o.icon className="h-6 w-6" /> {o.label}
                </button>
              ))}
            </div>
            {payment === "dinheiro" && (
              <div className="animate-in fade-in slide-in-from-top-2 space-y-1">
                <Label htmlFor="troco">Precisa de troco para quanto?</Label>
                <Input id="troco" inputMode="decimal" placeholder="Ex: 100,00" value={change} onChange={(e) => setChange(e.target.value)} className="h-12" />
              </div>
            )}
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-bold">Seus dados</h3>
            <Field id="name" label="Nome completo *" value={c.name} onChange={set("name")} />
            <div className="space-y-1">
              <Label htmlFor="cep">CEP *</Label>
              <div className="relative">
                <Input id="cep" inputMode="numeric" placeholder="00000-000" value={c.cep}
                  onChange={(e) => setC((p) => ({ ...p, cep: formatCep(e.target.value) }))} className="h-12" />
                {cepState === "loading" && <Loader2 className="absolute right-3 top-3.5 h-5 w-5 animate-spin text-primary" />}
              </div>
              {cepState === "error" && <p className="text-sm text-destructive">CEP inválido ou não encontrado. Preencha o endereço manualmente.</p>}
            </div>
            <Field id="street" label="Rua *" value={c.street} onChange={set("street")} />
            <div className="grid grid-cols-2 gap-3">
              <Field id="number" label="Número *" value={c.number} onChange={set("number")} />
              <Field id="complement" label="Complemento" value={c.complement} onChange={set("complement")} />
            </div>
            <Field id="district" label="Bairro *" value={c.district} onChange={set("district")} />
            <Field id="city" label="Cidade *" value={c.city} onChange={set("city")} />
            <div className="space-y-1">
              <Label htmlFor="notes">Observações do pedido</Label>
              <Textarea id="notes" placeholder="Ex: sem cebola, borda recheada..." value={c.notes} onChange={set("notes")} />
            </div>
          </section>

          <Button variant="whatsapp" size="xl" className="h-16 w-full text-base" onClick={submit}>
            <MessageCircle className="!size-6" /> Finalizar pedido pelo WhatsApp
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between text-muted-foreground"><span>{label}</span><span className="font-semibold text-foreground">{value}</span></div>;
}

function Field({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (e: { target: { value: string } }) => void }) {
  return (
    <div className="space-y-1">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} value={value} onChange={onChange} className="h-12" />
    </div>
  );
}
