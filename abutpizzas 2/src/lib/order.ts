import { formatBRL, STORE } from "@/data/menu";

export type PaymentMethod = "pix" | "cartao" | "dinheiro";
export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  pix: "PIX",
  cartao: "Cartão de Crédito/Débito",
  dinheiro: "Dinheiro",
};

export interface OrderLine {
  name: string;
  price: number;
  qty: number;
}

export interface Customer {
  name: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  district: string;
  city: string;
  notes: string;
}

export const calcSubtotal = (lines: OrderLine[]) =>
  Math.round(lines.reduce((s, l) => s + l.price * l.qty, 0) * 100) / 100;

export const calcTotal = (lines: OrderLine[]) =>
  lines.length === 0 ? 0 : Math.round((calcSubtotal(lines) + STORE.deliveryFee) * 100) / 100;

export function validateOrder(
  lines: OrderLine[],
  c: Customer,
  payment: PaymentMethod | null,
  change: string,
): string | null {
  if (lines.length === 0) return "Seu carrinho está vazio.";
  if (c.name.trim().length < 3) return "Informe seu nome completo.";
  if (c.cep.replace(/\D/g, "").length !== 8) return "Informe um CEP válido.";
  if (!c.street.trim() || !c.number.trim() || !c.district.trim() || !c.city.trim())
    return "Preencha o endereço completo (rua, número, bairro e cidade).";
  if (!payment) return "Escolha a forma de pagamento.";
  if (payment === "dinheiro") {
    const v = parseMoney(change);
    if (!v) return "Informe para quanto precisa de troco.";
    if (v < calcTotal(lines)) return "O valor do troco deve ser maior ou igual ao total.";
  }
  return null;
}

export const parseMoney = (s: string) => {
  const n = parseFloat(s.replace(/[^\d,.]/g, "").replace(/\./g, "").replace(",", "."));
  return isNaN(n) ? 0 : n;
};

export function buildMessage(
  lines: OrderLine[],
  c: Customer,
  payment: PaymentMethod,
  change: string,
) {
  const items = lines
    .map(
      (l) =>
        `• ${l.name}\n  Quantidade: ${l.qty}\n  Valor unitário: ${formatBRL(l.price)}\n  Total: ${formatBRL(l.price * l.qty)}`,
    )
    .join("\n\n");
  const parts = [
    `Olá ${STORE.name}! Meu nome é ${c.name.trim()}.`,
    "",
    "Gostaria de fazer o seguinte pedido:",
    "",
    items,
    "",
    `OBSERVAÇÕES: ${c.notes.trim() || "Nenhuma"}`,
    "",
    "RESUMO DO PEDIDO:",
    `Subtotal: ${formatBRL(calcSubtotal(lines))}`,
    `Taxa de entrega: ${formatBRL(STORE.deliveryFee)}`,
    `Total final: ${formatBRL(calcTotal(lines))}`,
    "",
    `Forma de pagamento: ${PAYMENT_LABELS[payment]}`,
  ];
  if (payment === "dinheiro") parts.push(`Troco para ${formatBRL(parseMoney(change))}`);
  parts.push(
    "",
    "ENDEREÇO PARA ENTREGA:",
    `Rua: ${c.street}`,
    `Número: ${c.number}`,
    `Complemento: ${c.complement || "-"}`,
    `Bairro: ${c.district}`,
    `Cidade: ${c.city}`,
    `CEP: ${c.cep}`,
    "",
    "Obrigado!",
  );
  return parts.join("\n");
}

export const whatsappUrl = (msg: string) =>
  `https://wa.me/${STORE.whatsappNumber}?text=${encodeURIComponent(msg)}`;
