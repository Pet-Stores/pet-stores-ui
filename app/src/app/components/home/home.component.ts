import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from '../navbar/navbar.component';
import { FavoritesService, FavoriteItem } from '../../services/favorites.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatIconModule, NavbarComponent]
})
export class HomeComponent {
  private favoritesService = inject(FavoritesService);

  // Mock de Produtos para demonstração
  public products = signal<FavoriteItem[]>([
    { id: 101, name: 'Ração Royal Canin Gatos', price: 215.90, sellerName: 'Petz', image: 'assets/img/Pet Stores (50 × 50 px)/1.svg' },
    { id: 102, name: 'Arranhador Sisal 3 Níveis', price: 189.00, sellerName: 'Cobasi', image: 'assets/img/Pet Stores (50 × 50 px)/2.svg' },
    { id: 103, name: 'Brinquedo Peixe com Catnip', price: 34.90, sellerName: 'Petz', image: 'assets/img/Pet Stores (50 × 50 px)/3.svg' },
    { id: 104, name: 'Cama Pet Soft Confort', price: 129.90, sellerName: 'PetShop Online', image: 'assets/img/Pet Stores (50 × 50 px)/4.svg' },
  ]);

  toggleFavorite(product: FavoriteItem) {
    this.favoritesService.toggleFavorite(product);
  }

  isFavorite(id: number): boolean {
    return this.favoritesService.isFavorite(id);
  }
}
