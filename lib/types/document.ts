export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedBy: {
    id: string;
    name: string;
    email: string;
  };
  uploadedAt: string;
} 