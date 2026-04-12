export type Product = {
  id: string;
  name: string;
  description: string;
  short_description: string;
  price: number;
  discount: number;
  discount_description?: string;
  category: string;
  related_to: string[];
  img_hero_url: string;
  img_gallery_urls: string[];
  img_3d_url?: string;
  parts?: ProductParts[]
};

type ProductParts ={
  id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  discount_description?: string;
}

export type Category = "weapon" | "melee" | "medical" | "ammunition" | "parts";
