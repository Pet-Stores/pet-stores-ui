import { Injectable, signal, computed } from '@angular/core';

export interface FavoriteItem {
  id: number;
  name: string;
  price: number;
  image: string;
  sellerName: string;
}

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  /**
   * ESTADO DOS FAVORITOS (Centralizado com Signals)
   */
  private _favoriteItems = signal<FavoriteItem[]>([]);

  public favoriteItems = this._favoriteItems.asReadonly();

  public favoritesCount = computed(() => this._favoriteItems().length);

  constructor() {
    // Carregar favoritos do localStorage ao iniciar
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      try {
        this._favoriteItems.set(JSON.parse(savedFavorites));
      } catch (e) {
        console.error('Erro ao carregar favoritos:', e);
      }
    }
  }

  /**
   * Persiste os favoritos no localStorage
   */
  private saveToStorage() {
    localStorage.setItem('favorites', JSON.stringify(this._favoriteItems()));
  }

  /**
   * Adiciona ou remove um item dos favoritos (Toggle)
   */
  public toggleFavorite(item: FavoriteItem) {
    this._favoriteItems.update(items => {
      const exists = items.find(i => i.id === item.id);
      let newItems;
      if (exists) {
        newItems = items.filter(i => i.id !== item.id);
      } else {
        newItems = [...items, item];
      }
      return newItems;
    });
    this.saveToStorage();
  }

  /**
   * Verifica se um item está nos favoritos
   */
  public isFavorite(id: number): boolean {
    return this._favoriteItems().some(item => item.id === id);
  }

  /**
   * Remove um item específico
   */
  public removeFavorite(id: number) {
    this._favoriteItems.update(items => items.filter(item => item.id !== id));
    this.saveToStorage();
  }

  /**
   * Limpa todos os favoritos
   */
  public clearFavorites() {
    this._favoriteItems.set([]);
    localStorage.removeItem('favorites');
  }

  /**
   * TODO: Integrar com o Backend (Sincronizar Favoritos)
   * 
   * Endpoint esperado: GET /api/favorites
   * Endpoint esperado: POST /api/favorites/{productId}
   * Endpoint esperado: DELETE /api/favorites/{productId}
   */
}
