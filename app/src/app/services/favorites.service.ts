import { Injectable, signal, computed, effect } from '@angular/core';

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
    this.initFavorites();

    // Efeito para salvar no localStorage sempre que os favoritos mudarem
    effect(() => {
      localStorage.setItem('favorites', JSON.stringify(this._favoriteItems()));
    });
  }

  private initFavorites() {
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
   * TODO: Integração Backend - Toggle Favorito
   * Endpoint: POST /api/favorites/toggle/{productId}
   */
  public toggleFavorite(item: FavoriteItem) {
    this._favoriteItems.update(items => {
      const exists = items.find(i => i.id === item.id);
      return exists ? items.filter(i => i.id !== item.id) : [...items, item];
    });
  }

  /**
   * Verifica se um item está nos favoritos
   */
  public isFavorite(id: number): boolean {
    return this._favoriteItems().some(item => item.id === id);
  }

  /**
   * TODO: Integração Backend - Remover Favorito
   * Endpoint: DELETE /api/favorites/{productId}
   */
  public removeFavorite(id: number) {
    this._favoriteItems.update(items => items.filter(item => item.id !== id));
  }

  /**
   * TODO: Integração Backend - Limpar Favoritos
   * Endpoint: DELETE /api/favorites/clear
   */
  public clearFavorites() {
    this._favoriteItems.set([]);
  }

  /**
   * TODO: Integração Backend - Sincronizar Favoritos (Initial Load)
   * Endpoint: GET /api/favorites
   */
  public syncFavoritesFromBackend() {}
}
