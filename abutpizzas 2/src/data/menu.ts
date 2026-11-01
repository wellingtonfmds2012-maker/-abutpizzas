import calabresa from "@/assets/calabresa.jpg";
import mussarela from "@/assets/mussarela.jpg";
import portuguesa from "@/assets/portuguesa.jpg";
import frango from "@/assets/frango.jpg";
import quatroQueijos from "@/assets/quatroqueijos.jpg";
import bacon from "@/assets/bacon.jpg";
import comboFamilia from "@/assets/combofamilia.jpg";
import comboCasal from "@/assets/combocasal.jpg";
import coca from "@/assets/coca.jpg";
import guarana from "@/assets/guarana.jpg";

/** Configurações centrais da pizzaria — altere aqui. */
export const STORE = {
  name: "ABUTPIZZAS",
  slogan: "O sabor que conquista!",
  whatsappNumber: "5581993846296",
  phoneDisplay: "(81) 99384-6296",
  address: "Endereço da pizzaria — substituir",
  hours: "Todos os dias, 18h às 23h30",
  deliveryFee: 5,
};

export type CategoryId = "mais-vendidas" | "tradicionais" | "especiais" | "combos" | "bebidas";

export const CATEGORIES: { id: CategoryId; label: string }[] = [
  { id: "mais-vendidas", label: "Mais Vendidas" },
  { id: "tradicionais", label: "Pizzas Tradicionais" },
  { id: "especiais", label: "Pizzas Especiais" },
  { id: "combos", label: "Combos" },
  { id: "bebidas", label: "Bebidas" },
];

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categories: CategoryId[];
}

export const PRODUCTS: Product[] = [
  { id: "calabresa", name: "Pizza Calabresa", price: 39.9, image: calabresa, categories: ["mais-vendidas", "tradicionais"], description: "Molho artesanal, mussarela, calabresa fatiada, cebola e orégano." },
  { id: "mussarela", name: "Pizza Mussarela", price: 37.9, image: mussarela, categories: ["mais-vendidas", "tradicionais"], description: "Molho especial, mussarela derretida, tomate e orégano." },
  { id: "portuguesa", name: "Pizza Portuguesa", price: 44.9, image: portuguesa, categories: ["mais-vendidas", "tradicionais"], description: "Mussarela, presunto, ovos, cebola, azeitonas e orégano." },
  { id: "frango", name: "Pizza Frango com Catupiry", price: 47.9, image: frango, categories: ["especiais"], description: "Frango desfiado temperado, catupiry original, mussarela e orégano." },
  { id: "quatro-queijos", name: "Pizza Quatro Queijos", price: 49.9, image: quatroQueijos, categories: ["especiais"], description: "Mussarela, parmesão, provolone e gorgonzola." },
  { id: "bacon", name: "Pizza Bacon Especial", price: 49.9, image: bacon, categories: ["especiais"], description: "Mussarela, bacon crocante, molho artesanal e orégano." },
  { id: "combo-familia", name: "Combo Família", price: 69.9, image: comboFamilia, categories: ["combos"], description: "Uma pizza grande de calabresa, uma pizza pequena de mussarela e um refrigerante de 1 litro." },
  { id: "combo-casal", name: "Combo Casal", price: 54.9, image: comboCasal, categories: ["combos"], description: "Uma pizza média de sua preferência e um refrigerante de 600 ml." },
  { id: "coca-2l", name: "Coca-Cola 2 Litros", price: 13, image: coca, categories: ["bebidas"], description: "Refrigerante Coca-Cola original." },
  { id: "guarana-2l", name: "Guaraná Antarctica 2 Litros", price: 11, image: guarana, categories: ["bebidas"], description: "Refrigerante Guaraná Antarctica." },
];

export const formatBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
