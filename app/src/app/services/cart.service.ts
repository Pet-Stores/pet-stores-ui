import { Injectable, signal, computed, effect } from '@angular/core';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  sellerName: string;
  image: string;
  selected: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  /**
   * ESTADO DO CARRINHO (Reativo com Signals)
   */
  private _cartItems = signal<CartItem[]>([]);

  constructor() {
    this.initCart();
    
    // Efeito de persistência local automática
    effect(() => {
      localStorage.setItem('cart', JSON.stringify(this._cartItems()));
    });
  }

  private initCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        this._cartItems.set(JSON.parse(savedCart));
      } catch (e) {
        this.setInitialMockCart();
      }
    } else {
      this.setInitialMockCart();
    }
  }

  private setInitialMockCart() {
    this._cartItems.set([
      { id: 1, name: 'Ração Premium Gatos Adultos 10kg', price: 189.90, quantity: 1, sellerName: 'Petshop do João', image: 'assets/mock/racao_premium_10kg.png', selected: true },
      { id: 2, name: 'Arranhador para Gatos Torre Luxo', price: 250.00, quantity: 1, sellerName: 'Petshop do João', image: 'assets/mock/arranhador_luxo.png', selected: true },
      { id: 3, name: 'Brinquedo Interativo Lançador de Bolinhas', price: 45.90, quantity: 2, sellerName: 'Mundo Animal Maria', image: 'assets/mock/lancador_bolinhas.png', selected: false },
      { id: 4, name: 'Cama Pet Nuvem Extra Macia G', price: 120.00, quantity: 1, sellerName: 'Mundo Animal Maria', image: 'assets/mock/cama_pet_g.png', selected: false },
      { id: 5, name: 'Coleira com GPS e LED', price: 89.00, quantity: 1, sellerName: 'Mundo Animal Maria', image: 'assets/mock/coleira_gps.png', selected: false },
      { id: 6, name: 'Shampoo Neutro 500ml', price: 35.00, quantity: 1, sellerName: 'Mundo Animal Maria', image: 'assets/mock/shampoo_neutro.png', selected: false },
    ]);
  }

  public cartItems = this._cartItems.asReadonly();

  /**
   * CÁLCULOS REATIVOS
   */
  public totalItemsCount = computed(() => this._cartItems().reduce((sum, item) => sum + item.quantity, 0));
  public totalSelected = computed(() => this._cartItems().filter(item => item.selected).reduce((total, item) => total + (item.price * item.quantity), 0));
  public selectedCount = computed(() => this._cartItems().filter(item => item.selected).length);
  public isAllCartSelected = computed(() => this._cartItems().length > 0 && this._cartItems().every(item => item.selected));

  public groupedItems = computed(() => {
    const items = this._cartItems();
    const groups: { [key: string]: CartItem[] } = {};
    items.forEach(item => {
      if (!groups[item.sellerName]) groups[item.sellerName] = [];
      groups[item.sellerName].push(item);
    });
    return Object.keys(groups).map(seller => ({
      seller,
      items: groups[seller],
      allSelected: groups[seller].every(i => i.selected)
    }));
  });

  /**
   * MÉTODOS DE MANIPULAÇÃO
   */

  /**
   * TODO: Integração Backend - Sincronizar Item (Toggle Selection)
   * Endpoint: PATCH /api/cart/items/{id}/toggle-select
   * Payload: { selected: boolean }
   */
  toggleItem(id: number) {
    this._cartItems.update(items => items.map(item => item.id === id ? { ...item, selected: !item.selected } : item));
  }

  /**
   * TODO: Integração Backend - Sincronizar Vendedor (Toggle Seller Selection)
   * Endpoint: PATCH /api/cart/sellers/toggle-select
   * Payload: { sellerName: string, selected: boolean }
   */
  toggleSeller(sellerName: string, selectAll: boolean) {
    this._cartItems.update(items => items.map(item => item.sellerName === sellerName ? { ...item, selected: selectAll } : item));
  }

  /**
   * TODO: Integração Backend - Sincronizar Seleção Total
   * Endpoint: PATCH /api/cart/toggle-select-all
   * Payload: { selected: boolean }
   */
  toggleAllCart(selectAll: boolean) {
    this._cartItems.update(items => items.map(item => ({ ...item, selected: selectAll })));
  }

  /**
   * TODO: Integração Backend - Remover Item
   * Endpoint: DELETE /api/cart/items/{id}
   */
  removeItem(id: number) {
    this._cartItems.update(items => items.filter(item => item.id !== id));
  }

  /**
   * TODO: Integração Backend - Atualizar Quantidade (Sync com Stock)
   * Endpoint: PATCH /api/cart/items/{id}/quantity
   * Payload: { quantity: number }
   */
  incrementQuantity(id: number) {
    this._cartItems.update(items => items.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
  }

  decrementQuantity(id: number) {
    this._cartItems.update(items => items.map(item => (item.id === id && item.quantity > 1) ? { ...item, quantity: item.quantity - 1 } : item));
  }

  /**
   * TODO: Integração Backend - Adicionar ao Carrinho
   * Endpoint: POST /api/cart/items
   * Payload: { productId: number, quantity: number }
   */
  addItem(item: CartItem) {
    this._cartItems.update(items => {
      const existingItemIndex = items.findIndex(i => i.id === item.id);
      if (existingItemIndex > -1) {
        const updatedItems = [...items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + item.quantity
        };
        return updatedItems;
      }
      return [...items, item];
    });
  }

  /**
   * TODO: Integração Backend - Limpar Carrinho pós-venda
   * Endpoint: DELETE /api/cart/clear
   */
  clearCart() {
    this._cartItems.set([]);
  }
}
