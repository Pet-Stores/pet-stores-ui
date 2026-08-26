import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule, Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { OrderService, Order, OrderStatus } from '../../services/order.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    RouterModule,
    NavbarComponent
  ],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent {
  public orderService = inject(OrderService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  // Sinais consumidos diretamente do serviço
  public activeOrders = this.orderService.activeOrders;
  public pastOrders = this.orderService.pastOrders;
  public groupedActiveOrders = this.orderService.groupedActiveOrders;
  public groupedPastOrders = this.orderService.groupedPastOrders;
  public groupingMode = this.orderService.groupingMode;
  public pipelineSteps = this.orderService.getPipelineSteps();

  /**
   * Alterna entre agrupamento por Vendedor ou por Ano
   */
  public changeGrouping(mode: 'seller' | 'year'): void {
    this.orderService.setGroupingMode(mode);
  }

  /**
   * Calcula o percentual de preenchimento da barra verde do pipeline
   */
  public getPipelineProgressPercent(currentStepIndex: number): number {
    switch (currentStepIndex) {
      case 0: return 12;  // Preparando seu pedido
      case 1: return 42;  // Coletando seu pedido
      case 2: return 75;  // Pedido em trânsito
      case 3: return 100; // Pedido entregue
      default: return 0;
    }
  }

  /**
   * Verifica se a etapa já foi concluída
   */
  public isStepCompleted(stepIndex: number, currentStepIndex: number): boolean {
    return stepIndex < currentStepIndex;
  }

  /**
   * Verifica se a etapa é a atualmente ativa no tracking
   */
  public isStepActive(stepIndex: number, currentStepIndex: number): boolean {
    return stepIndex === currentStepIndex;
  }

  /**
   * Reordena todos os itens do pedido e redireciona ou avisa no SnackBar
   */
  public handleReorder(order: Order): void {
    this.orderService.reorder(order);
    const snackRef = this.snackBar.open(
      `Itens do pedido ${order.orderNumber} adicionados ao seu carrinho!`,
      'VER CARRINHO',
      {
        duration: 4500,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['premium-snackbar']
      }
    );

    snackRef.onAction().subscribe(() => {
      this.router.navigate(['/cart']);
    });
  }

  /**
   * Informações visuais para status do pedido
   */
  public getStatusInfo(status: OrderStatus): { label: string; cssClass: string; icon: string } {
    switch (status) {
      case 'PREPARING':
        return { label: 'Preparando Pedido', cssClass: 'status-preparing', icon: 'inventory_2' };
      case 'COLLECTING':
        return { label: 'Pronto para Coleta', cssClass: 'status-collecting', icon: 'shopping_bag' };
      case 'IN_TRANSIT':
        return { label: 'Em Trânsito', cssClass: 'status-transit', icon: 'two_wheeler' };
      case 'DELIVERED':
        return { label: 'Entregue', cssClass: 'status-delivered', icon: 'check_circle' };
      case 'CANCELLED':
        return { label: 'Cancelado', cssClass: 'status-cancelled', icon: 'cancel' };
      default:
        return { label: status, cssClass: 'status-default', icon: 'info' };
    }
  }
}

