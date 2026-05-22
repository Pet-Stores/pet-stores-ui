import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatCheckboxModule, MatButtonModule, RouterModule, NavbarComponent],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
  // Injeção do serviço usando a nova sintaxe do Angular
  public cartService = inject(CartService);

  /**
   * Atalhos para o estado do serviço (Signals)
   * Consumimos diretamente do serviço para manter a fonte da verdade única.
   */
  public cartItems = this.cartService.cartItems;
  public groupedItems = this.cartService.groupedItems;
  public totalSelected = this.cartService.totalSelected;
  public selectedCount = this.cartService.selectedCount;
  public isAllCartSelected = this.cartService.isAllCartSelected;

  /**
   * Métodos delegados ao serviço
   */
  toggleItem(id: number) {
    this.cartService.toggleItem(id);
  }

  toggleSeller(sellerName: string, selectAll: boolean) {
    this.cartService.toggleSeller(sellerName, selectAll);
  }

  toggleAllCart(selectAll: boolean) {
    this.cartService.toggleAllCart(selectAll);
  }

  removeItem(id: number) {
    this.cartService.removeItem(id);
  }
}
