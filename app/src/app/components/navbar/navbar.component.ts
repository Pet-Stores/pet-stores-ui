import { Component, HostListener, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatInputModule } from '@angular/material/input';
import { RouterModule, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';

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
      RouterModule
    ]
})
export class NavbarComponent implements OnInit, OnDestroy {
  // Injeção de dependências
  private cartService = inject(CartService);
  public router = inject(Router);

  // Expondo a lista de itens do carrinho
  public cartItems = this.cartService.cartItems;

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

  funcaoTeste() {
    console.log('Abriu dialog . . .');
    this.openMenu.update(value => !value);
  }

}
