import { Component, HostListener, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterModule, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { FavoritesService } from '../../services/favorites.service';
import { LoginComponent } from '../auth/login/login.component';
import { ForgotPasswordComponent } from '../auth/forgot-password/forgot-password.component';
import { RegisterComponent } from '../auth/register/register.component';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
    standalone: true,
    imports: [
      CommonModule,
      MatIconModule,
      MatButtonModule,
      MatSidenavModule,
      MatInputModule,
      MatDialogModule,
      RouterModule
    ]
})
export class NavbarComponent implements OnInit, OnDestroy {
  // Injeção de dependências
  private cartService = inject(CartService);
  public router = inject(Router);
  private dialog = inject(MatDialog);
  public authService = inject(AuthService);
  public favoritesService = inject(FavoritesService);

  // Expondo dados reativos
  public cartItems = this.cartService.cartItems;
  public cartItemsCount = this.cartService.totalItemsCount;
  public favoriteItems = this.favoritesService.favoriteItems;
  public favoritesCount = this.favoritesService.favoritesCount;

  public isMobileScreen = signal<boolean>(false);
  public showFiller = signal<boolean>(false);
  public openMenu = signal<boolean>(true);
  public animatedPlaceholder = signal<string>('');

  private phrases = [
    'O que seu pet precisa hoje?',
    'Procurando por ração?',
    'Encontre os melhores petshops...',
    'Agende um banho e tosa',
    'Marcas oficiais para seu pet',
    'Medicamentos e acessórios'
  ];
  private currentPhraseIndex = 0;
  private currentCharIndex = 0;
  private isDeleting = false;
  private typingSpeed = 100;
  private timeoutId: any;

  public listaPets = signal([
    {value: 'Gato'},
    {value: 'Cachorro'},
    {value: 'Papagaio'}
  ]);

  public listaLojas = signal([
    {value: 'Melhores avaliações'},
    {value: 'Próximas de você'},
    {value: 'Lojas oficiais'},
    {value: 'Aviários'},
    {value: 'Petshop'},
    {value: 'Banho e tosa'},
    {value: 'Veterinárias'},
    {value: 'Lojas agronomia'},
    {value: 'Lojas para pesca'}
  ]);

  public listaAgendamentos = signal([
    {value: 'Meus agendamentos'},
    {value: 'Criar agendamento'}
  ]);

  public listaMarcas = signal([
    {value: 'Rações'},
    {value: 'Medicamentos'},
    {value: 'Acessórios'},
    {value: 'Medicamentos'}
  ]);

  public listaServicos = signal([
    {value: 'Veterinários'},
    {value: 'Banho e tosa'},
    {value: 'Vacinação'},
    {value: 'Hotel para pet'},
    {value: 'Doações'},
    {value: 'Adote seu pet'}
  ]);

  public listaMais = signal([
    {value: 'Doe filhotes'},
    {value: 'Seja vendedor'},
    {value: 'Eventos'},
    {value: 'Trabalhe conosco'},
    {value: 'Feira pets'},
  ]);

  public listaAjuda = signal([
    {value: 'Entrega'},
    {value: 'Pedido'},
    {value: 'Conta'},
    {value: 'Denuncia'},
    {value: 'Pagamento'},
    {value: 'Outros'},
  ]);

  public listaOfertas = signal([
    {value: 'Ofertas do Dia'},
    {value: 'Seleção Premium'},
    {value: 'Outlet Pet'},
    {value: 'Assinatura Pet'},
  ]);

  public listaCupons = signal([
    {value: 'Meus Cupons'},
    {value: 'Cupons Primeira Compra'},
    {value: 'Frete Grátis'},
    {value: 'Indique e Ganhe'},
  ]);

  public listaVendedor = signal([
    {value: 'Quero Vender'},
    {value: 'Portal do Parceiro'},
    {value: 'Vantagens PS'},
    {value: 'Taxas e Prazos'},
  ]);

  public listaEntregador = signal([
    {value: 'Quero Entregar'},
    {value: 'App do Entregador'},
    {value: 'Meus Ganhos'},
    {value: 'Equipamentos'},
  ]);

  constructor() {}

  ngOnInit() {
    this.checkScreenSize();
    this.typeEffect();
  }

  ngOnDestroy() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  typeEffect() {
    const currentPhrase = this.phrases[this.currentPhraseIndex];
    
    if (this.isDeleting) {
      this.animatedPlaceholder.set(currentPhrase.substring(0, this.currentCharIndex - 1));
      this.currentCharIndex--;
    } else {
      this.animatedPlaceholder.set(currentPhrase.substring(0, this.currentCharIndex + 1));
      this.currentCharIndex++;
    }

    let delta = this.typingSpeed;

    if (this.isDeleting) {
      delta /= 2;
    }

    if (!this.isDeleting && this.currentCharIndex === currentPhrase.length) {
      this.isDeleting = true;
      delta = 2000;
    } else if (this.isDeleting && this.currentCharIndex === 0) {
      this.isDeleting = false;
      this.currentPhraseIndex = (this.currentPhraseIndex + 1) % this.phrases.length;
      delta = 500;
    }

    this.timeoutId = setTimeout(() => this.typeEffect(), delta);
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobileScreen.set(window.innerWidth <= 1114);
  }

  openLoginModal() {
    if (this.authService.isLoggedIn()) return;
    
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '100%',
      maxWidth: '450px',
      panelClass: 'custom-modal-container',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'forgot-password') {
        this.openForgotPasswordModal();
      } else if (result === 'register') {
        this.openRegisterModal();
      }
    });
  }

  openForgotPasswordModal() {
    const dialogRef = this.dialog.open(ForgotPasswordComponent, {
      width: '100%',
      maxWidth: '450px',
      panelClass: 'custom-modal-container',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'login') {
        this.openLoginModal();
      }
    });
  }

  openRegisterModal() {
    const dialogRef = this.dialog.open(RegisterComponent, {
      width: '100%',
      maxWidth: '650px',
      panelClass: 'custom-modal-container',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'login') {
        this.openLoginModal();
      }
    });
  }

  logout() {
    this.authService.logout();
  }

  funcaoTeste() {
    console.log('Abriu dialog . . .');
    this.openMenu.update(value => !value);
  }

}
