import { Injectable, signal, computed } from '@angular/core';

export interface ProductReview {
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  discountBadge?: string;
  images: string[];
  videoUrl?: string;
  description: string;
  shortDescription: string;
  sellerName: string;
  sellerRating: number;
  category: string;
  stock: number;
  features: string[];
  specifications: { label: string; value: string }[];
  reviews: ProductReview[];
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  /**
   * BASE DE DADOS MOCK (Simulando persistência de inventário)
   */
  private _products = signal<Product[]>([
    {
      id: 1,
      name: 'Ração Premium Gatos Adultos 10kg',
      slug: 'racao-premium-gatos-adultos-10kg',
      price: 189.90,
      originalPrice: 219.90,
      discountBadge: 'Melhor Preço',
      images: ['assets/mock/racao_premium_10kg.png'],
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      shortDescription: 'Nutrição completa para gatos adultos com paladar exigente.',
      description: 'A Ração Premium Gatos Adultos oferece todos os nutrientes necessários para uma vida saudável e ativa. Com ingredientes selecionados e alta absorção.',
      sellerName: 'Petshop do João',
      sellerRating: 4.7,
      category: 'Alimentação',
      stock: 25,
      features: ['Pelagem brilhante', 'Saúde intestinal', 'Controle de pH urinário'],
      specifications: [{ label: 'Peso', value: '10kg' }, { label: 'Idade', value: 'Adultos' }],
      reviews: [{ user: 'Ricardo M.', rating: 5, comment: 'Meus gatos amaram!', date: '2026-05-01' }]
    },
    {
      id: 2,
      name: 'Arranhador para Gatos Torre Luxo',
      slug: 'arranhador-gatos-torre-luxo',
      price: 250.00,
      images: ['assets/mock/arranhador_luxo.png'],
      shortDescription: 'Torre de diversão e descanso com acabamento premium.',
      description: 'Estrutura robusta revestida em sisal e pelúcia de alta qualidade. Ideal para gatos de todos os tamanhos.',
      sellerName: 'Petshop do João',
      sellerRating: 4.7,
      category: 'Móveis',
      stock: 10,
      features: ['Sisal natural', 'Fácil montagem', 'Base estável'],
      specifications: [{ label: 'Altura', value: '1.5m' }, { label: 'Material', value: 'Madeira e Sisal' }],
      reviews: []
    },
    {
      id: 3,
      name: 'Brinquedo Interativo Lançador de Bolinhas',
      slug: 'brinquedo-lancador-bolinhas',
      price: 45.90,
      images: ['assets/mock/lancador_bolinhas.png'],
      shortDescription: 'Mantenha seu pet ativo com o lançador automático.',
      description: 'Brinquedo ideal para cães e gatos, estimula o exercício e a agilidade mental.',
      sellerName: 'Mundo Animal Maria',
      sellerRating: 4.9,
      category: 'Brinquedos',
      stock: 15,
      features: ['Automático', 'Acompanha 3 bolinhas', 'Regulagem de distância'],
      specifications: [{ label: 'Bateria', value: 'Recarregável' }],
      reviews: []
    },
    {
      id: 4,
      name: 'Cama Pet Nuvem Extra Macia G',
      slug: 'cama-pet-nuvem-extra-macia-g',
      price: 120.00,
      images: ['assets/mock/cama_pet_g.png'],
      shortDescription: 'Conforto absoluto para o sono mais profundo do seu pet.',
      description: 'Cama com tecnologia anti-stress e toque ultra macio. Formato circular que traz segurança.',
      sellerName: 'Mundo Animal Maria',
      sellerRating: 4.9,
      category: 'Camas',
      stock: 20,
      features: ['Lavável', 'Anti-derrapante', 'Tamanho G'],
      specifications: [{ label: 'Diâmetro', value: '70cm' }],
      reviews: []
    },
    {
      id: 5,
      name: 'Coleira com GPS e LED',
      slug: 'coleira-gps-led',
      price: 89.00,
      images: ['assets/mock/coleira_gps.png'],
      shortDescription: 'Nunca perca seu pet de vista com rastreamento em tempo real.',
      description: 'Coleira inteligente conectada via aplicativo. Resistente à água e com luzes LED de segurança.',
      sellerName: 'Mundo Animal Maria',
      sellerRating: 4.9,
      category: 'Acessórios',
      stock: 30,
      features: ['GPS integrado', 'App gratuito', 'Luz de segurança'],
      specifications: [{ label: 'Resistência', value: 'IP67' }],
      reviews: []
    },
    {
      id: 6,
      name: 'Shampoo Neutro 500ml',
      slug: 'shampoo-neutro-500ml',
      price: 35.00,
      images: ['assets/mock/shampoo_neutro.png'],
      shortDescription: 'Limpeza suave para todos os tipos de pelagem.',
      description: 'Shampoo hipoalergênico com pH balanceado. Deixa o pelo macio e com cheirinho de limpeza.',
      sellerName: 'Mundo Animal Maria',
      sellerRating: 4.9,
      category: 'Higiene',
      stock: 50,
      features: ['Sem corantes', 'Hipoalergênico', 'Fragrância suave'],
      specifications: [{ label: 'Volume', value: '500ml' }],
      reviews: []
    },
    {
      id: 101,
      name: 'Ração Royal Canin Gatos Adultos Castrados',
      slug: 'racao-royal-canin-gatos-castrados',
      price: 215.90,
      originalPrice: 249.90,
      discountBadge: '15% OFF',
      images: ['assets/mock/racao_royal_canin.png'],
      shortDescription: 'Nutrição completa para gatos castrados (de 1 a 7 anos).',
      description: 'Ajuda a limitar o risco de ganho de peso excessivo com teor moderado de gorduras.',
      sellerName: 'Petz Oficial',
      sellerRating: 4.8,
      category: 'Alimentação',
      stock: 12,
      features: ['Peso ideal', 'Saúde urinária', 'Alta palatabilidade'],
      specifications: [{ label: 'Idade', value: 'Adultos' }],
      reviews: []
    }
  ]);

  public products = this._products.asReadonly();

  /**
   * TODO: Integração Backend - Obter Produto por ID
   * Endpoint: GET /api/products/{id}
   */
  public getProductById(id: number): Product | undefined {
    return this._products().find(p => p.id === id);
  }

  /**
   * TODO: Integração Backend - Obter Produtos Relacionados
   * Endpoint: GET /api/products/{id}/related
   */
  public getRelatedProducts(productId: number): Product[] {
    return this._products().filter(p => p.id !== productId).slice(0, 4);
  }

  /**
   * TODO: Integração Backend - Obter Todos os Produtos (Vitrine)
   * Endpoint: GET /api/products
   */
  public fetchAllProducts() {}
}
