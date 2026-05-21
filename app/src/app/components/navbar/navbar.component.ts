import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
    standalone: false
})
export class NavbarComponent implements OnInit {

  public isMobileScreen: boolean = false;
  public showFiller: boolean = false;
  public openMenu: boolean = true
  public listaPets: any[] = [
    {value: 'Gato'},
    {value: 'Cachorro'},
    {value: 'Papagaio'}
  ];
  public listaLojas: any[] = [
    {value: 'Melhores avaliações'},
    {value: 'Próximas de você'},
    {value: 'Lojas oficiais'},
    {value: 'Aviários'},
    {value: 'Petshop'},
    {value: 'Banho e tosa'},
    {value: 'Veterinárias'},
    {value: 'Lojas agronomia'},
    {value: 'Lojas para pesca'}
  ];
  public listaAgendamentos: any[] = [
    {value: 'Meus agendamentos'},
    {value: 'Criar agendamento'}
  ];
  public listaMarcas: any[] = [
    {value: 'Rações'},
    {value: 'Medicamentos'},
    {value: 'Acessórios'},
    {value: 'Medicamentos'}
  ];
  public listaServicos: any[] = [
    {value: 'Veterinários'},
    {value: 'Banho e tosa'},
    {value: 'Vacinação'},
    {value: 'Hotel para pet'},
    {value: 'Doações'},
    {value: 'Adote seu pet'}
  ];
  public listaMais: any[] = [
    {value: 'Doe filhotes'},
    {value: 'Seja vendedor'},
    {value: 'Eventos'},
    {value: 'Trabalhe conosco'},
    {value: 'Feira pets'},
  ];
  public listaAjuda: any[] = [
    {value: 'Entrega'},
    {value: 'Pedido'},
    {value: 'Conta'},
    {value: 'Denuncia'},
    {value: 'Pagamento'},
    {value: 'Outros'},
  ];

  constructor() {}

  ngOnInit() {
    this.checkScreenSize();
    window.addEventListener('resize', () => {
      console.log(this.checkScreenSize());

      this.checkScreenSize();
    });
  }

  checkScreenSize() {
    this.isMobileScreen = window.innerWidth <= 1114;
  }

  funcaoTeste() {
    console.log('Abriu dialog . . .');
    if (this.openMenu) {
      this.openMenu = false
    } else {
      this.openMenu = true
    }
  }

}
