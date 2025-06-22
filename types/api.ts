export interface User {
  id: string;
  name: string | null;
  email: string;
  role: "ADMIN" | "USER";
  image: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Product {
  id: string;
  name: string;
  quantity: number;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface Template {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  templateProducts: TemplateProduct[];
}

export interface TemplateProduct {
  id: string;
  templateId: string;
  productId: string;
  quantity: number;
  product: Product;
}

export interface Invoice {
  id: string;
  templateId: string;
  totalPrice: number;
  createdAt: string;
  template: {
    name: string;
  };
}

export interface DashboardStats {
  totalProducts: number;
  totalTemplates: number;
  totalInvoices: number;
  totalUsers: number;
}

export interface RecentActivity {
  id: string;
  type: "product" | "template" | "invoice" | "user";
  action:
    | "added"
    | "updated"
    | "deleted"
    | "created"
    | "modified"
    | "generated"
    | "joined"
    | "promoted"
    | "demoted";
  description: string;
  timestamp: string;
  user?: string;
}
