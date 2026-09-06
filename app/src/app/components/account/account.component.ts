import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { AuthService, User, UserRole, UserAddress, PaymentCard, PixKey, Pet } from '../../services/auth.service';
import { OrderService, Order } from '../../services/order.service';

export type AccountTab = 'overview' | 'personal' | 'roles' | 'pets' | 'wallet' | 'security' | 'preferences';

export interface MonthlyExpense {
  month: string;
  year: number;
  amount: number;
  orderCount: number;
  heightPercent: number;
}

export interface CategoryExpense {
  category: string;
  amount: number;
  percentage: number;
  color: string;
  icon: string;
}

export interface Invoice {
  id: string;
  orderNumber: string;
  invoiceNumber: string;
  series: string;
  accessKey: string;
  seller: string;
  sellerCnpj: string;
  date: string;
  year: number;
  amount: number;
  itemsSummary: string;
  status: 'AUTHORIZED' | 'EMITTED';
}

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTabsModule
  ],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  private authService = inject(AuthService);
  private orderService = inject(OrderService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Aba ativa selecionada
  public activeTab = signal<AccountTab>('overview');

  // Usuário reativo
  public user = computed(() => this.authService.currentUser());

  // Modais / formulários abertos
  public showAddAddress = signal<boolean>(false);
  public showAddCard = signal<boolean>(false);
  public showAddPix = signal<boolean>(false);
  public showAddPet = signal<boolean>(false);
  public showChangePassword = signal<boolean>(false);

  // Forms
  public profileForm!: FormGroup;
  public addressForm!: FormGroup;
  public cardForm!: FormGroup;
  public pixForm!: FormGroup;
  public petForm!: FormGroup;
  public sellerForm!: FormGroup;
  public deliveryForm!: FormGroup;
  public passwordForm!: FormGroup;

  // Catálogo de espécies para pets
  public readonly speciesList = [
    { id: 'dog', name: 'Cão / Cachorro', icon: 'pets' },
    { id: 'cat', name: 'Gato', icon: 'pets' },
    { id: 'bird', name: 'Pássaro / Ave', icon: 'flutter_dash' },
    { id: 'fish', name: 'Peixe', icon: 'water' },
    { id: 'rodent', name: 'Roedor', icon: 'cruelty_free' },
    { id: 'other', name: 'Outros Animais', icon: 'category' }
  ];

  // Sessões ativas mock
  public activeSessions = [
    { device: 'MacBook Pro 16" (Este dispositivo)', location: 'São Paulo, Brasil', browser: 'Chrome • Ativo agora', current: true, icon: 'laptop_mac' },
    { device: 'iPhone 15 Pro Max', location: 'São Paulo, Brasil', browser: 'App Mobile • Há 2 horas', current: false, icon: 'smartphone' },
    { device: 'iPad Air 5ª Geração', location: 'Curitiba, Brasil', browser: 'Safari • 28 de Agosto', current: false, icon: 'tablet_mac' }
  ];

  // Histórico de Cupons & Economia
  public economyHighlights = [
    { title: 'Cupom de Boas-Vindas (PRIMEIRACOMPRA)', discount: 45.00, date: '18/05/2026', store: 'Petz Oficial' },
    { title: 'Frete Grátis Express Sul/Sudeste', discount: 18.00, date: '26/08/2026', store: 'Petz Oficial' },
    { title: 'Desconto Pagamento Instantâneo PIX (5%)', discount: 7.99, date: '10/04/2026', store: 'Mundo Animal' },
    { title: 'Cupom Especial Mês do Pet (PETLOVE10)', discount: 25.50, date: '20/11/2025', store: 'Cobasi Express' }
  ];

  // Métricas calculadas dinamicamente
  public totalSpent2026 = computed(() => {
    const orders2026 = this.orderService.orders().filter(o => o.year === 2026);
    return orders2026.reduce((acc, o) => acc + o.total, 0);
  });

  public totalSpent2025 = computed(() => {
    const orders2025 = this.orderService.orders().filter(o => o.year === 2025);
    return orders2025.reduce((acc, o) => acc + o.total, 0);
  });

  public totalSavings = computed(() => 125.49);
  public couponsAppliedCount = computed(() => 6);
  public cashbackBalance = computed(() => this.user()?.cashbackBalance || 68.50);

  // Gráfico mensal (12 meses)
  public monthlyExpenses = signal<MonthlyExpense[]>([
    { month: 'Set/25', year: 2025, amount: 111.90, orderCount: 1, heightPercent: 28 },
    { month: 'Out/25', year: 2025, amount: 89.50, orderCount: 1, heightPercent: 22 },
    { month: 'Nov/25', year: 2025, amount: 149.90, orderCount: 1, heightPercent: 38 },
    { month: 'Dez/25', year: 2025, amount: 210.00, orderCount: 2, heightPercent: 53 },
    { month: 'Jan/26', year: 2026, amount: 130.00, orderCount: 1, heightPercent: 33 },
    { month: 'Fev/26', year: 2026, amount: 95.00, orderCount: 1, heightPercent: 24 },
    { month: 'Mar/26', year: 2026, amount: 175.40, orderCount: 2, heightPercent: 44 },
    { month: 'Abr/26', year: 2026, amount: 151.91, orderCount: 1, heightPercent: 39 },
    { month: 'Mai/26', year: 2026, amount: 389.89, orderCount: 2, heightPercent: 98 },
    { month: 'Jun/26', year: 2026, amount: 120.00, orderCount: 1, heightPercent: 30 },
    { month: 'Jul/26', year: 2026, amount: 190.20, orderCount: 2, heightPercent: 48 },
    { month: 'Ago/26', year: 2026, amount: 604.70, orderCount: 2, heightPercent: 100 }
  ]);

  // Gráfico de Categorias (Donut)
  public categoryExpenses = signal<CategoryExpense[]>([
    { category: 'Alimentação & Rações', amount: 589.70, percentage: 48, color: '#3C2A20', icon: 'restaurant' },
    { category: 'Acessórios & Brinquedos', amount: 299.80, percentage: 24, color: '#ea580c', icon: 'toys' },
    { category: 'Higiene & Banho', amount: 196.89, percentage: 16, color: '#d97706', icon: 'shower' },
    { category: 'Saúde & Farmácia', amount: 147.60, percentage: 12, color: '#059669', icon: 'medical_services' }
  ]);

  // Pedidos recentes (últimos 3)
  public recentOrders = computed(() => {
    return this.orderService.orders().slice(0, 3);
  });

  // Notas Fiscais e Comprovantes
  public invoices = signal<Invoice[]>([
    {
      id: 'inv-1',
      orderNumber: 'PET-2026-8941',
      invoiceNumber: '000.412.891',
      series: '1',
      accessKey: '3526 0818 3281 1800 0109 5500 1000 4128 9110 9482 1729',
      seller: 'Petz Oficial',
      sellerCnpj: '18.328.118/0001-09',
      date: '26/08/2026',
      year: 2026,
      amount: 389.80,
      itemsSummary: 'Ração Royal Canin Maxi Adult (15kg) + Lançador Automático de Bolinhas',
      status: 'AUTHORIZED'
    },
    {
      id: 'inv-2',
      orderNumber: 'PET-2026-8942',
      invoiceNumber: '000.398.214',
      series: '2',
      accessKey: '3526 0853 1539 3800 0112 5500 2000 3982 1410 8821 3410',
      seller: 'Cobasi Express',
      sellerCnpj: '53.153.938/0001-12',
      date: '26/08/2026',
      year: 2026,
      amount: 214.90,
      itemsSummary: 'Arranhador Torre Luxo com Rede para Gatos',
      status: 'AUTHORIZED'
    },
    {
      id: 'inv-3',
      orderNumber: 'PET-2026-7201',
      invoiceNumber: '000.281.092',
      series: '1',
      accessKey: '3526 0518 3281 1800 0109 5500 1000 2810 9210 5542 1098',
      seller: 'Petz Oficial',
      sellerCnpj: '18.328.118/0001-09',
      date: '18/05/2026',
      year: 2026,
      amount: 389.89,
      itemsSummary: 'Coleira Inteligente GPS + Shampoo Neutro Hipoalergênico',
      status: 'AUTHORIZED'
    },
    {
      id: 'inv-4',
      orderNumber: 'PET-2026-5120',
      invoiceNumber: '000.194.551',
      series: '1',
      accessKey: '3526 0429 4018 8200 0144 5500 1000 1945 5110 3382 9102',
      seller: 'Mundo Animal Pet Care',
      sellerCnpj: '29.401.882/0001-44',
      date: '10/04/2026',
      year: 2026,
      amount: 151.91,
      itemsSummary: 'Cama Pet Nuvem Ortopédica Lavável (Tamanho G)',
      status: 'AUTHORIZED'
    },
    {
      id: 'inv-5',
      orderNumber: 'PET-2025-9831',
      invoiceNumber: '000.089.412',
      series: '1',
      accessKey: '3525 1153 1539 3800 0112 5500 1000 0894 1210 1192 8371',
      seller: 'Cobasi Express',
      sellerCnpj: '53.153.938/0001-12',
      date: '20/11/2025',
      year: 2025,
      amount: 149.90,
      itemsSummary: 'Ração Special Dog Prime Cães Adultos 10kg',
      status: 'AUTHORIZED'
    },
    {
      id: 'inv-6',
      orderNumber: 'PET-2025-4190',
      invoiceNumber: '000.065.183',
      series: '1',
      accessKey: '3525 0918 3281 1800 0109 5500 1000 0651 8310 7401 2284',
      seller: 'Petz Oficial',
      sellerCnpj: '18.328.118/0001-09',
      date: '15/09/2025',
      year: 2025,
      amount: 111.90,
      itemsSummary: 'Comedouro Automático Digital e Antipulgas Bravecto',
      status: 'AUTHORIZED'
    }
  ]);

  public invoiceSearch = signal<string>('');
  public invoiceYearFilter = signal<string>('ALL');

  public filteredInvoices = computed(() => {
    const search = this.invoiceSearch().toLowerCase().trim();
    const year = this.invoiceYearFilter();

    return this.invoices().filter(inv => {
      const matchYear = year === 'ALL' || inv.year.toString() === year;
      const matchSearch = !search ||
        inv.invoiceNumber.toLowerCase().includes(search) ||
        inv.orderNumber.toLowerCase().includes(search) ||
        inv.seller.toLowerCase().includes(search) ||
        inv.accessKey.replace(/\s+/g, '').includes(search.replace(/\s+/g, ''));
      return matchYear && matchSearch;
    });
  });

  ngOnInit(): void {
    // Carregar tab via queryParam se fornecida (ex: ?tab=preferences)
    this.route.queryParams.subscribe(params => {
      if (params['tab']) {
        this.activeTab.set(params['tab'] as AccountTab);
      }
    });

    this.initForms();
  }

  private initForms(): void {
    const u = this.user();

    this.profileForm = this.fb.group({
      fullName: [u?.fullName || '', [Validators.required, Validators.minLength(3)]],
      email: [u?.email || '', [Validators.required, Validators.email]],
      phone: [u?.phone || '', [Validators.required]],
      cpfCnpj: [u?.cpfCnpj || '123.456.789-00'],
      birthDate: [u?.birthDate || '1995-06-15']
    });

    this.addressForm = this.fb.group({
      title: ['', Validators.required],
      street: ['', Validators.required],
      number: ['', Validators.required],
      complement: [''],
      neighborhood: ['', Validators.required],
      city: ['', Validators.required],
      state: ['SP', Validators.required],
      zipCode: ['', [Validators.required, Validators.minLength(8)]],
      isDefault: [false]
    });

    this.cardForm = this.fb.group({
      holderName: ['', Validators.required],
      cardNumber: ['', [Validators.required, Validators.minLength(16)]],
      expiry: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/)]],
      cvv: ['', [Validators.required, Validators.minLength(3)]],
      brand: ['mastercard', Validators.required],
      isDefault: [false]
    });

    this.pixForm = this.fb.group({
      type: ['CPF', Validators.required],
      key: ['', Validators.required],
      isDefault: [false]
    });

    this.petForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      species: ['Cão / Cachorro', Validators.required],
      birthDate: [''],
      gender: ['male', Validators.required],
      documentName: ['']
    });

    this.sellerForm = this.fb.group({
      storeName: [u?.sellerData?.storeName || '', Validators.required],
      cnpj: [u?.sellerData?.cnpj || '', Validators.required],
      category: [u?.sellerData?.category || 'Acessórios & Cuidados Pet', Validators.required]
    });

    this.deliveryForm = this.fb.group({
      vehicleType: [u?.deliveryData?.vehicleType || 'moto', Validators.required],
      plate: [u?.deliveryData?.plate || '', Validators.required],
      cnhNumber: [u?.deliveryData?.cnhNumber || '', Validators.required]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: (group) => {
        const p = group.get('newPassword')?.value;
        const c = group.get('confirmPassword')?.value;
        return p === c ? null : { passwordMismatch: true };
      }
    });
  }

  public setTab(tab: AccountTab): void {
    this.activeTab.set(tab);
    // Atualiza a URL sem recarregar
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab },
      queryParamsHandling: 'merge'
    });
  }

  public onSaveProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.authService.updateProfile(this.profileForm.value);
    this.showToast('Perfil atualizado com sucesso! ✨');
  }

  public onAddAddress(): void {
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    }

    const newAddr: UserAddress = {
      id: 'addr-' + Date.now(),
      ...this.addressForm.value
    };

    this.authService.addAddress(newAddr);
    this.addressForm.reset({ state: 'SP', isDefault: false });
    this.showAddAddress.set(false);
    this.showToast('Novo endereço adicionado com sucesso! 📍');
  }

  public onRemoveAddress(id: string): void {
    this.authService.removeAddress(id);
    this.showToast('Endereço removido.');
  }

  public onSetDefaultAddress(id: string): void {
    this.authService.setDefaultAddress(id);
    this.showToast('Endereço padrão atualizado!');
  }

  public onAddCard(): void {
    if (this.cardForm.invalid) {
      this.cardForm.markAllAsTouched();
      return;
    }

    const val = this.cardForm.value;
    const newCard: PaymentCard = {
      id: 'card-' + Date.now(),
      brand: val.brand,
      last4: val.cardNumber.slice(-4),
      holderName: val.holderName.toUpperCase(),
      expiry: val.expiry,
      isDefault: val.isDefault
    };

    this.authService.addPaymentCard(newCard);
    this.cardForm.reset({ brand: 'mastercard', isDefault: false });
    this.showAddCard.set(false);
    this.showToast('Novo cartão adicionado com segurança! 💳');
  }

  public onRemoveCard(id: string): void {
    this.authService.removePaymentCard(id);
    this.showToast('Cartão removido.');
  }

  public onAddPix(): void {
    if (this.pixForm.invalid) {
      this.pixForm.markAllAsTouched();
      return;
    }

    const newPix: PixKey = {
      id: 'pix-' + Date.now(),
      ...this.pixForm.value
    };

    this.authService.addPixKey(newPix);
    this.pixForm.reset({ type: 'CPF', isDefault: false });
    this.showAddPix.set(false);
    this.showToast('Chave PIX cadastrada!');
  }

  public onRemovePix(id: string): void {
    this.authService.removePixKey(id);
    this.showToast('Chave PIX removida.');
  }

  public onAddPet(): void {
    if (this.petForm.invalid) {
      this.petForm.markAllAsTouched();
      return;
    }

    const newPet: Pet = {
      id: 'pet-' + Date.now(),
      ...this.petForm.value
    };

    this.authService.addPet(newPet);
    this.petForm.reset({ species: 'Cão / Cachorro', gender: 'male' });
    this.showAddPet.set(false);
    this.showToast(`Pet ${newPet.name} cadastrado com sucesso! 🐾`);
  }

  public onRemovePet(index: number): void {
    this.authService.removePet(index);
    this.showToast('Pet removido.');
  }

  public onPetDocUpload(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.petForm.patchValue({ documentName: file.name });
      this.showToast(`Documento ${file.name} anexado.`);
    }
  }

  public switchUserRole(role: UserRole): void {
    this.authService.switchRole(role);
    const label = role === 'buyer' ? 'Comprador' : role === 'seller' ? 'Vendedor' : 'Entregador';
    this.showToast(`Perfil alternado para ${label}! 🔄`);
  }

  public onRegisterSeller(): void {
    if (this.sellerForm.invalid) {
      this.sellerForm.markAllAsTouched();
      return;
    }

    this.authService.updateProfile({
      sellerData: {
        ...this.sellerForm.value,
        status: 'active',
        totalSales: 0,
        rating: 5.0
      }
    });

    this.authService.switchRole('seller');
    this.showToast('Conta de Vendedor ativada com sucesso! 🏪');
  }

  public onRegisterDelivery(): void {
    if (this.deliveryForm.invalid) {
      this.deliveryForm.markAllAsTouched();
      return;
    }

    this.authService.updateProfile({
      deliveryData: {
        ...this.deliveryForm.value,
        status: 'active',
        totalDeliveries: 0,
        rating: 5.0
      }
    });

    this.authService.switchRole('delivery_person');
    this.showToast('Conta de Entregador ativada com sucesso! 🛵');
  }

  public onChangePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.passwordForm.reset();
    this.showChangePassword.set(false);
    this.showToast('Senha alterada com sucesso! 🔒');
  }

  public toggleNotification(key: 'whatsapp' | 'emailOffers' | 'smsDelivery' | 'orderUpdates'): void {
    const current = this.user()?.notifications || { whatsapp: true, emailOffers: true, smsDelivery: true, orderUpdates: true };
    const updated = {
      ...current,
      [key]: !current[key]
    };
    this.authService.updateNotifications(updated);
    this.showToast('Preferências de notificação atualizadas.');
  }

  public toggleLinkedAccount(provider: 'google' | 'apple' | 'facebook'): void {
    const current = this.user()?.linkedAccounts || { google: true, apple: false, facebook: false };
    const updated = {
      ...current,
      [provider]: !current[provider]
    };
    this.authService.updateLinkedAccounts(updated);
    const status = updated[provider] ? 'vinculada' : 'desvinculada';
    this.showToast(`Conta ${provider.toUpperCase()} ${status}!`);
  }

  public endOtherSessions(): void {
    this.activeSessions = this.activeSessions.filter(s => s.current);
    this.showToast('Todas as outras sessões foram encerradas com segurança.');
  }

  public exportData(): void {
    this.showToast('Seus dados cadastrais foram compilados e enviados para seu e-mail.');
  }

  public logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
    this.showToast('Você saiu da sua conta.');
  }

  public downloadDanfe(inv: Invoice): void {
    const content = `======================================================
DOCUMENTO AUXILIAR DA NOTA FISCAL ELETRÔNICA (DANFE)
======================================================
NF-e Nº: ${inv.invoiceNumber} - Série: ${inv.series}
Data de Emissão: ${inv.date}
Chave de Acesso: ${inv.accessKey}

EMITENTE:
Razão Social: ${inv.seller}
CNPJ: ${inv.sellerCnpj}

DESTINATÁRIO:
Nome: ${this.user()?.fullName || 'Johnny Carvalho'}
CPF: ${this.user()?.cpfCnpj || '123.456.789-00'}

DADOS DO PEDIDO:
Pedido: ${inv.orderNumber}
Itens: ${inv.itemsSummary}
Valor Total da Nota: R$ ${inv.amount.toFixed(2)}
Forma de Pagamento: Cartão de Crédito / PIX

Protocolo de Autorização de Uso:
135260098412891 - Autorizada em ${inv.date} às 14:32:10
======================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `DANFE_NFe_${inv.invoiceNumber.replace(/\./g, '')}.txt`;
    link.click();
    window.URL.revokeObjectURL(url);

    this.showToast(`DANFE da NF-e nº ${inv.invoiceNumber} baixado com sucesso! 📄`);
  }

  public downloadXml(inv: Invoice): void {
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<nfeProc xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00">
  <NFe>
    <infNFe Id="NFe${inv.accessKey.replace(/\s+/g, '')}" versao="4.00">
      <ide>
        <nNF>${inv.invoiceNumber.replace(/\./g, '')}</nNF>
        <serie>${inv.series}</serie>
        <dhEmi>${inv.date}T14:30:00-03:00</dhEmi>
        <tpNF>1</tpNF>
      </ide>
      <emit>
        <CNPJ>${inv.sellerCnpj.replace(/\D/g, '')}</CNPJ>
        <xNome>${inv.seller}</xNome>
      </emit>
      <dest>
        <CPF>${(this.user()?.cpfCnpj || '12345678900').replace(/\D/g, '')}</CPF>
        <xNome>${this.user()?.fullName || 'Johnny Carvalho'}</xNome>
      </dest>
      <total>
        <ICMSTot>
          <vNF>${inv.amount.toFixed(2)}</vNF>
        </ICMSTot>
      </total>
    </infNFe>
  </NFe>
</nfeProc>`;

    const blob = new Blob([xmlContent], { type: 'application/xml;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `NFe_${inv.invoiceNumber.replace(/\./g, '')}.xml`;
    link.click();
    window.URL.revokeObjectURL(url);

    this.showToast(`XML da NF-e nº ${inv.invoiceNumber} baixado com sucesso! 📦`);
  }

  public copyAccessKey(key: string): void {
    navigator.clipboard.writeText(key.replace(/\s+/g, '')).then(() => {
      this.showToast('Chave de acesso copiada para a área de transferência! 📋');
    });
  }

  public calculatePetAge(birthDate?: string): string {
    if (!birthDate) return 'Idade não informada';
    const birth = new Date(birthDate);
    const now = new Date();
    const diffMonths = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
    if (diffMonths < 1) return 'Menos de 1 mês';
    if (diffMonths < 12) return `${diffMonths} ${diffMonths === 1 ? 'mês' : 'meses'}`;
    const years = Math.floor(diffMonths / 12);
    const remMonths = diffMonths % 12;
    return remMonths > 0
      ? `${years} ${years === 1 ? 'ano' : 'anos'} e ${remMonths}m`
      : `${years} ${years === 1 ? 'ano' : 'anos'}`;
  }

  private showToast(message: string): void {
    this.snackBar.open(message, 'OK', {
      duration: 3500,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: ['success-snackbar']
    });
  }
}
