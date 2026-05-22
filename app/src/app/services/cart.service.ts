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
   * Por enquanto, os dados estão mockados aqui. 
   * No futuro, este sinal será alimentado pela resposta da API.
   */
  private _cartItems = signal<CartItem[]>([
    { id: 1, name: 'Ração Premium Gatos Adultos 10kg', price: 189.90, quantity: 1, sellerName: 'Petshop do João', image: 'assets/img/Pet Stores (50 × 50 px)/1.svg', selected: true },
    { id: 2, name: 'Arranhador para Gatos Torre Luxo', price: 250.00, quantity: 1, sellerName: 'Petshop do João', image: 'assets/img/Pet Stores (50 × 50 px)/2.svg', selected: true },
    { id: 3, name: 'Brinquedo Interativo Lançador de Bolinhas', price: 45.90, quantity: 2, sellerName: 'Mundo Animal Maria', image: 'assets/img/Pet Stores (50 × 50 px)/3.svg', selected: false },
    { id: 4, name: 'Cama Pet Nuvem Extra Macia G', price: 120.00, quantity: 1, sellerName: 'Mundo Animal Maria', image: 'assets/img/Pet Stores (50 × 50 px)/4.svg', selected: false },
    { id: 5, name: 'Coleira com GPS e LED', price: 89.00, quantity: 1, sellerName: 'Mundo Animal Maria', image: 'assets/img/Pet Stores (50 × 50 px)/5.svg', selected: false },
    { id: 6, name: 'Shampoo Neutro 500ml', price: 35.00, quantity: 1, sellerName: 'Mundo Animal Maria', image: 'assets/img/Pet Stores (50 × 50 px)/6.svg', selected: false },
  ]);

  // Read-only signal para os componentes consumirem
  public cartItems = this._cartItems.asReadonly();

  /**
   * CÁLCULOS COMPUTADOS (Performance e Reatividade)
   * Estes valores se auto-atualizam sempre que o _cartItems mudar.
   */
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

  // Agrupamento por vendedor centralizado no serviço
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

  // constructor(private http: HttpClient) {} // Injetar HttpClient no futuro

  /**
   * BUSCAR ITENS DO BACKEND
   * TODO: Implementar chamada GET para /api/cart
   */
  loadCartFromBackend() {
    /*
    this.http.get<CartItem[]>('URL_DO_BACKEND/cart').subscribe(items => {
      this._cartItems.set(items);
    });
    */
  }

  /**
   * ATUALIZAR SELEÇÃO DE ITEM
   * TODO: No backend, isso pode disparar uma atualização de "sessão" ou cache.
   */
  toggleItem(id: number) {
    this._cartItems.update(items => 
      items.map(item => item.id === id ? { ...item, selected: !item.selected } : item)
    );
  }

  /**
   * SELECIONAR TODOS DE UM VENDEDOR
   */
  toggleSeller(sellerName: string, selectAll: boolean) {
    this._cartItems.update(items => 
      items.map(item => item.sellerName === sellerName ? { ...item, selected: selectAll } : item)
    );
  }

  /**
   * SELECIONAR TUDO NO CARRINHO
   */
  toggleAllCart(selectAll: boolean) {
    this._cartItems.update(items => 
      items.map(item => ({ ...item, selected: selectAll }))
    );
  }

  /**
   * REMOVER ITEM DO CARRINHO
   * TODO: Implementar chamada DELETE para /api/cart/{id}
   */
  removeItem(id: number) {
    // Ação Local (Otimista)
    this._cartItems.update(items => items.filter(item => item.id !== id));

    // Ação Remota
    /*
    this.http.delete(`URL_DO_BACKEND/cart/${id}`).subscribe({
      error: (err) => {
        // Tratar erro e talvez reverter a exclusão local se necessário
        console.error('Erro ao remover item', err);
      }
    });
    */
  }

  /**
   * ADICIONAR ITEM (Para ser usado em outras telas)
   * TODO: Implementar chamada POST para /api/cart
   */
  addItem(item: CartItem) {
    /*
    this.http.post('URL_DO_BACKEND/cart', item).subscribe(() => {
       this._cartItems.update(items => [...items, item]);
    });
    */
    this._cartItems.update(items => [...items, item]);
  }
}
