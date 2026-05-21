import { Component, HostListener, OnInit, signal } from '@angular/core';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
    standalone: false
})
export class NavbarComponent implements OnInit {

  public isMobileScreen = signal<boolean>(false);
  public showFiller = signal<boolean>(false);
  public openMenu = signal<boolean>(true);

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
  }

  @HostListener('window:resize', ['$event'])
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
