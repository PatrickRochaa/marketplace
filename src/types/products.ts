// src/types/products.ts
export interface ProductProps {
  id: number;
  name: string;
  description: string;
  full_description: string;
  price: number;
  category: number | string;
  image: string;
  folder_id: string;
  user_id: string;
  images: ProductImagesProps[];
}

export interface ProductImagesProps {
  name: string;
  uid: string;
  url: string | string;
  previewUrl: string | string;
  src: string | string[];
  file?: File; // Aqui estamos declarando a propriedade 'file' como opcional
}
