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
