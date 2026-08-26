import { Injectable, computed, inject, signal } from '@angular/core';
import { CartService } from './cart.service';

/**
 * Interface dos itens contidos em um pedido
 */
export interface OrderItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  seller: string;
  variation?: string;
}

/**
 * Status possíveis de um pedido
 */
export type OrderStatus = 'PREPARING' | 'COLLECTING' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';

/**
 * Definição dos passos do pipeline de acompanhamento
 */
export interface PipelineStep {
  index: number;
  id: string;
  label: string;
  description: string;
  icon: string;
}

/**
 * Passos padrão do fluxo do pedido
 */
export const ORDER_PIPELINE_STEPS: PipelineStep[] = [
  { index: 0, id: 'PREPARING', label: 'Preparando seu pedido', description: 'Loja separando os produtos', icon: 'inventory_2' },
  { index: 1, id: 'COLLECTING', label: 'Coletando seu pedido', description: 'Pronto para retirada do entregador', icon: 'shopping_bag' },
  { index: 2, id: 'IN_TRANSIT', label: 'Pedido em trânsito', description: 'A caminho do seu endereço', icon: 'local_shipping' },
  { index: 3, id: 'DELIVERED', label: 'Pedido entregue', description: 'Entregue com sucesso no destino', icon: 'check_circle' }
];

/**
 * Interface completa de um Pedido
 */
export interface Order {
  id: string;
  orderNumber: string;
  date: string;          // Formato ISO: YYYY-MM-DDTHH:mm:ss
  year: number;          // Ano para agrupamento no histórico (ex: 2026, 2025)
  seller: string;
  sellerLogo?: string;
  status: OrderStatus;
  currentStepIndex: number; // 0: Preparando, 1: Coletando, 2: Em trânsito, 3: Entregue
  estimatedDelivery: string;
  trackingCode?: string;
  deliveryAddress: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  paymentMethod: {
    type: 'CREDIT_CARD' | 'PIX' | 'BOLETO';
    details: string;
  };
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount?: number;
  total: number;
}

/**
 * Interface para agrupamento de pedidos no histórico
 */
export interface OrderGroup {
  groupKey: string;
  title: string;
  subTitle?: string;
  orders: Order[];
  totalOrdersCount: number;
  totalAmount: number;
}

/**
 * =========================================================================
 * BACKEND API CONTRATO & DTOs (Documentação para Integração Real)
 * =========================================================================
 *
 * TODO [BACKEND INTEGRATION]:
 * 1. Endpoints necessários:
 *    - GET    /api/v1/orders              -> Lista todos os pedidos do usuário autenticado
 *    - GET    /api/v1/orders/active       -> Lista pedidos ativos (status != DELIVERED && != CANCELLED)
 *    - GET    /api/v1/orders/:id          -> Detalhes de um pedido específico
 *    - GET    /api/v1/orders/:id/track    -> Dados de telemetria / rastreamento em tempo real
 *    - POST   /api/v1/orders/:id/reorder  -> Duplica itens do pedido para o carrinho ativo
 *    - POST   /api/v1/orders/:id/cancel   -> Solicita cancelamento do pedido
 *
 * 2. Headers esperados:
 *    - Authorization: Bearer <JWT_TOKEN>
 *    - X-User-Id: <USER_UUID>
 *
 * 3. Exemplo de Response DTO (PaginatedOrderResponseDTO):
 *    {
 *      "data": Order[],
 *      "meta": { "total": 12, "page": 1, "pageSize": 10, "totalPages": 2 }
 *    }
 * =========================================================================
 */

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private cartService = inject(CartService);

  /**
   * Estado de agrupamento do histórico: 'seller' (por loja) ou 'year' (por ano)
   */
  public groupingMode = signal<'seller' | 'year'>('seller');

  /**
   * Base de dados reativa de pedidos (Mock Database)
   */
  public orders = signal<Order[]>([
    // ==========================================
    // PEDIDOS EM ANDAMENTO (ACTIVE ORDERS)
    // ==========================================
    {
      id: 'ord-001',
      orderNumber: 'PET-2026-8941',
      date: '2026-08-26T07:30:00Z',
      year: 2026,
      seller: 'Petz Oficial',
      sellerLogo: 'assets/mock/racao_royal_canin.png',
      status: 'IN_TRANSIT',
      currentStepIndex: 2, // Pedido em trânsito
      estimatedDelivery: 'Hoje até às 18:30',
      trackingCode: 'BR-TRK-9928172',
      deliveryAddress: {
        street: 'Avenida Paulista',
        number: '1000, Apto 42',
        neighborhood: 'Bela Vista',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01310-100'
      },
      paymentMethod: {
        type: 'CREDIT_CARD',
        details: 'Mastercard final 4821 (1x de R$ 389,80)'
      },
      items: [
        {
          id: 101,
          productId: 1,
          name: 'Ração Royal Canin Maxi Adult - 15kg',
          price: 289.90,
          quantity: 1,
          image: 'assets/mock/racao_royal_canin.png',
          seller: 'Petz Oficial',
          variation: 'Sabor Carne & Frango'
        },
        {
          id: 102,
          productId: 5,
          name: 'Lançador Automático de Bolinhas Interativo',
          price: 99.90,
          quantity: 1,
          image: 'assets/mock/lancador_bolinhas.png',
          seller: 'Petz Oficial',
          variation: 'Bivolt Automático'
        }
      ],
      subtotal: 389.80,
      shipping: 0.00, // Frete Grátis
      total: 389.80
    },
    {
      id: 'ord-002',
      orderNumber: 'PET-2026-8942',
      date: '2026-08-26T06:15:00Z',
      year: 2026,
      seller: 'Cobasi Express',
      sellerLogo: 'assets/mock/arranhador_luxo.png',
      status: 'PREPARING',
      currentStepIndex: 0, // Preparando
      estimatedDelivery: 'Amanhã entre 10h e 14h',
      trackingCode: 'BR-TRK-7718293',
      deliveryAddress: {
        street: 'Avenida Paulista',
        number: '1000, Apto 42',
        neighborhood: 'Bela Vista',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01310-100'
      },
      paymentMethod: {
        type: 'PIX',
        details: 'Pagamento via PIX instantâneo'
      },
      items: [
        {
          id: 103,
          productId: 4,
          name: 'Arranhador Torre Luxo com Rede para Gatos',
          price: 199.90,
          quantity: 1,
          image: 'assets/mock/arranhador_luxo.png',
          seller: 'Cobasi Express',
          variation: 'Cinza Grafite'
        }
      ],
      subtotal: 199.90,
      shipping: 15.00,
      total: 214.90
    },

    // ==========================================
    // HISTÓRICO DE PEDIDOS (PAST ORDERS - 2026)
    // ==========================================
    {
      id: 'ord-003',
      orderNumber: 'PET-2026-7201',
      date: '2026-05-18T14:20:00Z',
      year: 2026,
      seller: 'Petz Oficial',
      sellerLogo: 'assets/mock/coleira_gps.png',
      status: 'DELIVERED',
      currentStepIndex: 3,
      estimatedDelivery: 'Entregue em 19/05/2026',
      trackingCode: 'BR-TRK-5542109',
      deliveryAddress: {
        street: 'Avenida Paulista',
        number: '1000, Apto 42',
        neighborhood: 'Bela Vista',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01310-100'
      },
      paymentMethod: {
        type: 'CREDIT_CARD',
        details: 'Visa final 9912 (2x de R$ 194,95)'
      },
      items: [
        {
          id: 104,
          productId: 3,
          name: 'Coleira Inteligente com Rastreamento GPS',
          price: 349.90,
          quantity: 1,
          image: 'assets/mock/coleira_gps.png',
          seller: 'Petz Oficial',
          variation: 'Tamanho M - Preta'
        },
        {
          id: 105,
          productId: 6,
          name: 'Shampoo Neutro Hipoalergênico Pet 500ml',
          price: 39.99,
          quantity: 1,
          image: 'assets/mock/shampoo_neutro.png',
          seller: 'Petz Oficial'
        }
      ],
      subtotal: 389.89,
      shipping: 0.00,
      total: 389.89
    },
    {
      id: 'ord-004',
      orderNumber: 'PET-2026-5120',
      date: '2026-04-10T11:00:00Z',
      year: 2026,
      seller: 'Mundo Animal Pet Care',
      sellerLogo: 'assets/mock/cama_pet_g.png',
      status: 'DELIVERED',
      currentStepIndex: 3,
      estimatedDelivery: 'Entregue em 12/04/2026',
      trackingCode: 'BR-TRK-3382910',
      deliveryAddress: {
        street: 'Avenida Paulista',
        number: '1000, Apto 42',
        neighborhood: 'Bela Vista',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01310-100'
      },
      paymentMethod: {
        type: 'PIX',
        details: 'PIX com 5% de desconto aplicado'
      },
      items: [
        {
          id: 106,
          productId: 2,
          name: 'Cama Pet Nuvem Ortopédica Lavável - Tamanho G',
          price: 159.90,
          quantity: 1,
          image: 'assets/mock/cama_pet_g.png',
          seller: 'Mundo Animal Pet Care',
          variation: 'Cinza Claro'
        }
      ],
      subtotal: 159.90,
      shipping: 0.00,
      discount: 7.99,
      total: 151.91
    },

    // ==========================================
    // HISTÓRICO DE PEDIDOS (PAST ORDERS - 2025)
    // ==========================================
    {
      id: 'ord-005',
      orderNumber: 'PET-2025-9831',
      date: '2025-11-20T16:45:00Z',
      year: 2025,
      seller: 'Cobasi Express',
      sellerLogo: 'assets/mock/racao_premium_10kg.png',
      status: 'DELIVERED',
      currentStepIndex: 3,
      estimatedDelivery: 'Entregue em 22/11/2025',
      trackingCode: 'BR-TRK-1192837',
      deliveryAddress: {
        street: 'Avenida Paulista',
        number: '1000, Apto 42',
        neighborhood: 'Bela Vista',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01310-100'
      },
      paymentMethod: {
        type: 'CREDIT_CARD',
        details: 'Mastercard final 4821 (1x de R$ 149,90)'
      },
      items: [
        {
          id: 107,
          productId: 7,
          name: 'Ração Special Dog Prime Cães Adultos 10kg',
          price: 149.90,
          quantity: 1,
          image: 'assets/mock/racao_premium_10kg.png',
          seller: 'Cobasi Express'
        }
      ],
      subtotal: 149.90,
      shipping: 0.00,
      total: 149.90
    },
    {
      id: 'ord-006',
      orderNumber: 'PET-2025-4102',
      date: '2025-08-15T09:30:00Z',
      year: 2025,
      seller: 'Petz Oficial',
      sellerLogo: 'assets/mock/lancador_bolinhas.png',
      status: 'DELIVERED',
      currentStepIndex: 3,
      estimatedDelivery: 'Entregue em 17/08/2025',
      trackingCode: 'BR-TRK-0029384',
      deliveryAddress: {
        street: 'Avenida Paulista',
        number: '1000, Apto 42',
        neighborhood: 'Bela Vista',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01310-100'
      },
      paymentMethod: {
        type: 'CREDIT_CARD',
        details: 'Visa final 9912'
      },
      items: [
        {
          id: 108,
          productId: 5,
          name: 'Lançador Automático de Bolinhas Interativo',
          price: 99.90,
          quantity: 1,
          image: 'assets/mock/lancador_bolinhas.png',
          seller: 'Petz Oficial'
        }
      ],
      subtotal: 99.90,
      shipping: 12.00,
      total: 111.90
    }
  ]);

  /**
   * Pedidos em andamento (status != DELIVERED && status != CANCELLED)
   */
  public activeOrders = computed(() => {
    return this.orders().filter(o => o.status !== 'DELIVERED' && o.status !== 'CANCELLED');
  });

  /**
   * Pedidos passados (histórico: DELIVERED ou CANCELLED)
   */
  public pastOrders = computed(() => {
    return this.orders().filter(o => o.status === 'DELIVERED' || o.status === 'CANCELLED');
  });

  /**
   * Pedidos ativos agrupados por Vendedor/Loja
   */
  public groupedActiveOrders = computed(() => {
    const list = this.activeOrders();
    const map = new Map<string, Order[]>();

    list.forEach(order => {
      if (!map.has(order.seller)) {
        map.set(order.seller, []);
      }
      map.get(order.seller)!.push(order);
    });

    const groups: OrderGroup[] = [];
    map.forEach((orders, seller) => {
      groups.push({
        groupKey: `active-seller-${seller}`,
        title: seller,
        orders,
        totalOrdersCount: orders.length,
        totalAmount: orders.reduce((sum, o) => sum + o.total, 0)
      });
    });

    return groups;
  });

  /**
   * Histórico de pedidos agrupados por Vendedor/Loja
   */
  public groupedPastBySeller = computed(() => {
    const list = this.pastOrders();
    const map = new Map<string, Order[]>();

    list.forEach(order => {
      if (!map.has(order.seller)) {
        map.set(order.seller, []);
      }
      map.get(order.seller)!.push(order);
    });

    const groups: OrderGroup[] = [];
    map.forEach((orders, seller) => {
      groups.push({
        groupKey: `past-seller-${seller}`,
        title: seller,
        subTitle: `${orders.length} ${orders.length === 1 ? 'pedido concluído' : 'pedidos concluídos'}`,
        orders,
        totalOrdersCount: orders.length,
        totalAmount: orders.reduce((sum, o) => sum + o.total, 0)
      });
    });

    return groups;
  });

  /**
   * Histórico de pedidos agrupados por Ano/Data
   */
  public groupedPastByYear = computed(() => {
    const list = this.pastOrders();
    const map = new Map<number, Order[]>();

    // Ordenar anos em ordem decrescente (ex: 2026, 2025...)
    list.forEach(order => {
      if (!map.has(order.year)) {
        map.set(order.year, []);
      }
      map.get(order.year)!.push(order);
    });

    const sortedYears = Array.from(map.keys()).sort((a, b) => b - a);

    const groups: OrderGroup[] = [];
    sortedYears.forEach(year => {
      const orders = map.get(year)!;
      groups.push({
        groupKey: `past-year-${year}`,
        title: `Ano de ${year}`,
        subTitle: `${orders.length} ${orders.length === 1 ? 'pedido realizado' : 'pedidos realizados'}`,
        orders,
        totalOrdersCount: orders.length,
        totalAmount: orders.reduce((sum, o) => sum + o.total, 0)
      });
    });

    return groups;
  });

  /**
   * Retorna os grupos do histórico de acordo com a seleção atual ('seller' ou 'year')
   */
  public groupedPastOrders = computed(() => {
    return this.groupingMode() === 'seller'
      ? this.groupedPastBySeller()
      : this.groupedPastByYear();
  });

  /**
   * Alterna o modo de agrupamento do histórico
   */
  public setGroupingMode(mode: 'seller' | 'year'): void {
    this.groupingMode.set(mode);
  }

  /**
   * Recria a compra adicionando todos os itens do pedido ao carrinho ativo
   */
  public reorder(order: Order): void {
    order.items.forEach(item => {
      this.cartService.addItem({
        id: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        sellerName: item.seller,
        image: item.image,
        selected: true
      });
    });
  }

  /**
   * Retorna a lista padrão das etapas do pipeline
   */
  public getPipelineSteps(): PipelineStep[] {
    return ORDER_PIPELINE_STEPS;
  }
}

