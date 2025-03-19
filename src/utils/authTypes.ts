
export interface Cafe {
  id: string;
  name: string;
  address?: string;
  logo?: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  cafe_id: string;
  role: 'admin' | 'staff';
  created_at: string;
}
