import { describe, it, expect } from "vitest";
import { calcSubtotal, calcTotal, validateOrder, type Customer } from "@/lib/order";

const lines = [{ name: "Calabresa", price: 39.9, qty: 2 }];
const c: Customer = { name: "João Silva", cep: "50000-000", street: "Rua A", number: "1", complement: "", district: "B", city: "Recife", notes: "" };

describe("order", () => {
  it("delivery fee is R$5", () => {
    expect(calcSubtotal(lines)).toBe(79.8);
    expect(calcTotal(lines)).toBe(84.8);
  });
  it("cash requires change", () => {
    expect(validateOrder(lines, c, "dinheiro", "")).not.toBeNull();
    expect(validateOrder(lines, c, "dinheiro", "100")).toBeNull();
  });
  it("empty cart rejected", () => {
    expect(validateOrder([], c, "pix", "")).toBe("Seu carrinho está vazio.");
  });
});
