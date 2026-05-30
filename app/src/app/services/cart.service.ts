import { Injectable, signal, computed } from '@angular/core';
// import { HttpClient } from '@angular/common/http'; // Descomentar quando integrar com backend

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
   * ESTADO DO CARRINHO (Centralizado com Signals)
   */
  private _cartItems = signal<CartItem[]>([
    { id: 1, name: 'Ração Premium Gatos Adultos 10kg', price: 189.90, quantity: 1, sellerName: 'Petshop do João', image: 'assets/img/Pet Stores (50 × 50 px)/1.svg', selected: true },
    { id: 2, name: 'Arranhador para Gatos Torre Luxo', price: 250.00, quantity: 1, sellerName: 'Petshop do João', image: 'assets/img/Pet Stores (50 × 50 px)/2.svg', selected: true },
    { id: 3, name: 'Brinquedo Interativo Lançador de Bolinhas', price: 45.90, quantity: 2, sellerName: 'Mundo Animal Maria', image: 'assets/img/Pet Stores (50 × 50 px)/3.svg', selected: false },
    { id: 4, name: 'Cama Pet Nuvem Extra Macia G', price: 120.00, quantity: 1, sellerName: 'Mundo Animal Maria', image: 'assets/img/Pet Stores (50 × 50 px)/4.svg', selected: false },
    { id: 5, name: 'Coleira com GPS e LED', price: 89.00, quantity: 1, sellerName: 'Mundo Animal Maria', image: 'assets/img/Pet Stores (50 × 50 px)/5.svg', selected: false },
    { id: 6, name: 'Shampoo Neutro 500ml', price: 35.00, quantity: 1, sellerName: 'Mundo Animal Maria', image: 'assets/img/Pet Stores (50 × 50 px)/6.svg', selected: false },
  ]);

  public cartItems = this._cartItems.asReadonly();

  public totalSelected = computed(() => {
    return this._cartItems()
      .filter(item => item.selected)
      .reduce((total, item) => total + (item.price * item.quantity), 0);
  });

  public selectedCount = computed(() => {
    return this._cartItems().filter(item => item.selected).length;
  });

  public isAllCartSelected = computed(() => {
    return this._cartItems().length > 0 && this._cartItems().every(item => item.selected);
  });

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
   * TODO: Integrar com o Backend (Carregar Carrinho)
   * 
   * Endpoint esperado: GET /api/cart
   * 
   * Dados a enviar:
   * - Cabeçalho HTTP: Authorization: Bearer JWT_ACCESS_TOKEN_STRING
   * 
   * Formato de retorno esperado (Response - HTTP 200):
   * [
   *   {
   *     "id": 1,
   *     "name": "Ração Premium Gatos Adultos 10kg",
   *     "price": 189.90,
   *     "quantity": 1,
   *     "sellerName": "Petshop do João",
   *     "image": "assets/img/...svg",
   *     "selected": true
   *   },
   *   ...
   * ]
   */
  loadCartFromBackend() {}

  /**
   * TODO: Integrar com o Backend (Sincronizar Seleção de Item)
   * 
   * Nota: Se a seleção for persistida no backend:
   * Endpoint esperado: PATCH /api/cart/items/{id}/toggle-select
   * 
   * Dados a enviar:
   * - Cabeçalho HTTP: Authorization: Bearer JWT_ACCESS_TOKEN_STRING
   * 
   * Formato de retorno esperado (Response - HTTP 200):
   * { "id": 1, "selected": true/false }
   */
  toggleItem(id: number) {
    this._cartItems.update(items => 
      items.map(item => item.id === id ? { ...item, selected: !item.selected } : item)
    );
  }

  /**
   * TODO: Integrar com o Backend (Sincronizar Seleção do Vendedor)
   * 
   * Nota: Se a seleção for persistida no backend:
   * Endpoint esperado: PATCH /api/cart/sellers/toggle-select
   * 
   * Dados a enviar (Payload/Request):
   * {
   *   "sellerName": "Petshop do João",
   *   "selected": true/false
   * }
   */
  toggleSeller(sellerName: string, selectAll: boolean) {
    this._cartItems.update(items => 
      items.map(item => item.sellerName === sellerName ? { ...item, selected: selectAll } : item)
    );
  }

  /**
   * TODO: Integrar com o Backend (Sincronizar Seleção de Todos os Itens)
   * 
   * Nota: Se a seleção for persistida no backend:
   * Endpoint esperado: PATCH /api/cart/toggle-select-all
   * 
   * Dados a enviar (Payload/Request):
   * {
   *   "selected": true/false
   * }
   */
  toggleAllCart(selectAll: boolean) {
    this._cartItems.update(items => 
      items.map(item => ({ ...item, selected: selectAll }))
    );
  }

  /**
   * TODO: Integrar com o Backend (Remover Item do Carrinho)
   * 
   * Endpoint esperado: DELETE /api/cart/items/{id}
   * 
   * Dados a enviar:
   * - Parâmetro de rota: id
   * - Cabeçalho HTTP: Authorization: Bearer JWT_ACCESS_TOKEN_STRING
   * 
   * Formato de retorno esperado (Response - HTTP 200 / 204):
   * (Sem conteúdo ou confirmação de sucesso)
   */
  removeItem(id: number) {
    this._cartItems.update(items => items.filter(item => item.id !== id));
  }

  /**
   * TODO: Integrar com o Backend (Incrementar Quantidade)
   * 
   * Endpoint esperado: PATCH /api/cart/items/{id}/quantity
   * 
   * Dados a enviar (Payload/Request):
   * {
   *   "quantity": 3 // Nova quantidade ou quantidade a incrementar (+1)
   * }
   * 
   * Formato de retorno esperado (Response - HTTP 200):
   * {
   *   "id": 1,
   *   "quantity": 3
   * }
   */
  incrementQuantity(id: number) {
    this._cartItems.update(items => 
      items.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item)
    );
  }

  /**
   * TODO: Integrar com o Backend (Decrementar Quantidade)
   * 
   * Endpoint esperado: PATCH /api/cart/items/{id}/quantity
   * 
   * Dados a enviar (Payload/Request):
   * {
   *   "quantity": 1 // Nova quantidade
   * }
   */
  decrementQuantity(id: number) {
    this._cartItems.update(items => 
      items.map(item => {
        if (item.id === id && item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      })
    );
  }

  /**
   * TODO: Integrar com o Backend (Adicionar Item ao Carrinho)
   * 
   * Endpoint esperado: POST /api/cart/items
   * 
   * Dados a enviar (Payload/Request):
   * {
   *   "productId": 1,
   *   "quantity": 1
   * }
   * 
   * Formato de retorno esperado (Response - HTTP 201):
   * {
   *   "id": 1, // ID do registro no carrinho
   *   "productId": 1,
   *   "name": "Ração Premium Gatos Adultos 10kg",
   *   "price": 189.90,
   *   "quantity": 1,
   *   "sellerName": "Petshop do João",
   *   "image": "assets/img/...svg",
   *   "selected": true
   * }
   */
  addItem(item: CartItem) {
    this._cartItems.update(items => [...items, item]);
  }
}
