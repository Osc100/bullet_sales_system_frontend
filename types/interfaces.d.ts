interface ApiError {
  [key: string]: string;
}

interface BaseModel {
  id: number;
  name: string;
}

interface Category extends BaseModel {}

interface Product extends BaseModel {
  sale_price: number;
  alert_quantity: number;
  category: string;
  quantity: number;
}

interface Batch {
  id: number;
  buy_price: number;
  date_created: Date;
  obsolete_date: Date | null;
  product: number;
  product_name: string;
  quantity: number;
  initial_quantity: number;
}

interface SellProduct {
  product: Product;
  quantity: number;
}

interface CompleteSale {
  date_sold: Date;
  id: number;
  reverted: boolean;
  sold_by_name: string;
  sales: IndividualSale[];
  sold_by: number;
}

interface IndividualSale {
  category_name: string;
  complete_sale: number;
  id: number;
  product_name: string;
  quantity_sold: number;
  total_cost: number;
  total_renevue: number;
  total_sold: number;
  unit_price: number;
}
