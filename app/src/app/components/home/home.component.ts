import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FavoritesService } from '../../services/favorites.service';
import { ProductService, Product } from '../../services/product.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatIconModule, RouterModule, NavbarComponent]
})
export class HomeComponent {
  private favoritesService = inject(FavoritesService);
  private productService = inject(ProductService);

  // Produtos vindos do serviço centralizado
  public products = this.productService.products;

  toggleFavorite(product: Product) {
    this.favoritesService.toggleFavorite({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      sellerName: product.sellerName
    });
  }

  isFavorite(id: number): boolean {
    return this.favoritesService.isFavorite(id);
  }
}
