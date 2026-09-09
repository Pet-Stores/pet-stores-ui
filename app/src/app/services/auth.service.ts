import { Injectable, signal, computed } from '@angular/core';

export interface Pet {
  id?: string;
  name: string;
  species: string;
  birthDate?: string;
  gender?: 'male' | 'female';
  documentName?: string;
}

export interface UserAddress {
  id: string;
  title: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

export interface PaymentCard {
  id: string;
  brand: 'mastercard' | 'visa' | 'elo' | 'amex';
  last4: string;
  holderName: string;
  expiry: string;
  isDefault: boolean;
}

export interface PixKey {
  id: string;
  type: 'CPF' | 'EMAIL' | 'PHONE' | 'RANDOM';
  key: string;
  isDefault: boolean;
}

export type UserRole = 'buyer' | 'seller' | 'delivery_person';

export interface SellerProfileData {
  storeName: string;
  cnpj: string;
  status: 'active' | 'pending';
  category: string;
  totalSales?: number;
  rating?: number;
}

export interface DeliveryProfileData {
  vehicleType: 'bicycle' | 'moto' | 'car';
  plate?: string;
  cnhNumber?: string;
  status: 'active' | 'pending';
  totalDeliveries?: number;
  rating?: number;
}

export interface UserNotifications {
  whatsapp: boolean;
  emailOffers: boolean;
  smsDelivery: boolean;
  orderUpdates: boolean;
}

export interface LinkedAccounts {
  google: boolean;
  apple: boolean;
  facebook: boolean;
}

export interface User {
  id: string;
  firstName: string;
  fullName: string;
  email?: string;
  phone?: string;
  cpfCnpj?: string;
  birthDate?: string;
  profileImage: string;
  role: UserRole;
  enabledRoles: UserRole[];
  sellerData?: SellerProfileData;
  deliveryData?: DeliveryProfileData;
  addresses?: UserAddress[];
  paymentCards?: PaymentCard[];
  pixKeys?: PixKey[];
  pets?: Pet[];
  notifications?: UserNotifications;
  linkedAccounts?: LinkedAccounts;
  loyaltyTier?: string;
  cashbackBalance?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Mock users
  private mockUsers: User[] = [
    {
      id: '1',
      firstName: 'Johnny',
      fullName: 'Johnny Carvalho',
      email: 'johnny@gmail.com',
      phone: '+55 (41) 99534-1904',
      cpfCnpj: '123.456.789-00',
      birthDate: '1995-06-15',
      profileImage: 'assets/img/perfil-image.jpeg',
      role: 'buyer',
      enabledRoles: ['buyer', 'seller'],
      loyaltyTier: 'Membro Diamante 💎',
      cashbackBalance: 68.50,
      sellerData: {
        storeName: 'JC Pet Premium Store',
        cnpj: '12.345.678/0001-90',
        category: 'Acessórios & Alimentação Natural',
        status: 'active',
        totalSales: 42,
        rating: 4.9
      },
      deliveryData: {
        vehicleType: 'moto',
        plate: 'BRA-2E19',
        cnhNumber: '09876543210',
        status: 'pending',
        totalDeliveries: 0,
        rating: 5.0
      },
      addresses: [
        {
          id: 'addr-1',
          title: 'Casa (Principal)',
          street: 'Avenida Paulista',
          number: '1000',
          complement: 'Apto 42',
          neighborhood: 'Bela Vista',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01310-100',
          isDefault: true
        },
        {
          id: 'addr-2',
          title: 'Trabalho / Escritório',
          street: 'Rua Funchal',
          number: '418',
          complement: 'Conjunto 102',
          neighborhood: 'Vila Olímpia',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '04551-060',
          isDefault: false
        }
      ],
      paymentCards: [
        {
          id: 'card-1',
          brand: 'mastercard',
          last4: '4821',
          holderName: 'JOHNNY CARVALHO',
          expiry: '08/29',
          isDefault: true
        },
        {
          id: 'card-2',
          brand: 'visa',
          last4: '9912',
          holderName: 'JOHNNY CARVALHO',
          expiry: '11/27',
          isDefault: false
        }
      ],
      pixKeys: [
        {
          id: 'pix-1',
          type: 'CPF',
          key: '123.456.789-00',
          isDefault: true
        },
        {
          id: 'pix-2',
          type: 'EMAIL',
          key: 'johnny@gmail.com',
          isDefault: false
        }
      ],
      pets: [
        {
          id: 'pet-1',
          name: 'Thor',
          species: 'Cão / Cachorro',
          birthDate: '2022-03-10',
          gender: 'male',
          documentName: 'carteira_vacinacao_thor.pdf'
        },
        {
          id: 'pet-2',
          name: 'Mel',
          species: 'Gato',
          birthDate: '2023-07-22',
          gender: 'female',
          documentName: 'rga_mel_microchip.png'
        }
      ],
      notifications: {
        whatsapp: true,
        emailOffers: true,
        smsDelivery: true,
        orderUpdates: true
      },
      linkedAccounts: {
        google: true,
        apple: false,
        facebook: false
      }
    }
  ];

  // Current logged in user state
  private _currentUser = signal<User | null>(null);

  // Public computed signals
  public currentUser = computed(() => this._currentUser());
  public isLoggedIn = computed(() => this._currentUser() !== null);
  public userFirstName = computed(() => this._currentUser()?.firstName || 'Perfil');
  public userRole = computed(() => this._currentUser()?.role || 'buyer');

  constructor() {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        if (!user.profileImage || user.profileImage.includes('perfil-image.jpeg')) {
          user.profileImage = 'assets/img/perfil-image.jpeg';
        }
        // Assegura valores padrão caso o usuário no localStorage seja antigo
        if (!user.role) user.role = 'buyer';
        if (!user.enabledRoles) user.enabledRoles = ['buyer'];
        if (!user.addresses) user.addresses = this.mockUsers[0].addresses;
        if (!user.paymentCards) user.paymentCards = this.mockUsers[0].paymentCards;
        if (!user.pixKeys) user.pixKeys = this.mockUsers[0].pixKeys;
        if (!user.pets) user.pets = this.mockUsers[0].pets;
        if (!user.notifications) user.notifications = this.mockUsers[0].notifications;
        if (!user.linkedAccounts) user.linkedAccounts = this.mockUsers[0].linkedAccounts;
        if (!user.loyaltyTier) user.loyaltyTier = 'Membro Diamante 💎';
        if (!user.cashbackBalance) user.cashbackBalance = 68.50;

        this._currentUser.set(user);
        localStorage.setItem('user', JSON.stringify(user));
      } catch (e) {
        this._currentUser.set(this.mockUsers[0]);
      }
    } else {
      // Mock inicial padrão para desenvolvimento e testes
      this._currentUser.set(this.mockUsers[0]);
      localStorage.setItem('user', JSON.stringify(this.mockUsers[0]));
    }
  }

  login(identifier: string, password: string): boolean {
    if (password !== '123456') return false;

    const user = this.mockUsers.find(u =>
      u.email === identifier || u.phone === identifier
    ) || this.mockUsers[0];

    if (user) {
      this._currentUser.set(user);
      localStorage.setItem('user', JSON.stringify(user));
      return true;
    }

    return false;
  }

  register(userData: any): boolean {
    console.log('[AuthService] Realizando cadastro mock:', userData);

    const newUser: User = {
      id: Math.random().toString(36).substring(2, 9),
      firstName: userData.fullName.split(' ')[0],
      fullName: userData.fullName,
      email: userData.identifier?.includes('@') ? userData.identifier : undefined,
      phone: !userData.identifier?.includes('@') ? userData.identifier : undefined,
      profileImage: 'assets/img/perfil-image.jpeg',
      role: userData.profileType || 'buyer',
      enabledRoles: [userData.profileType || 'buyer'],
      pets: userData.pets && userData.pets.length > 0 ? userData.pets : [],
      addresses: [
        {
          id: 'addr-' + Date.now(),
          title: 'Principal',
          street: userData.address?.logradouro || 'Avenida Paulista',
          number: userData.address?.number || '1000',
          neighborhood: 'Centro',
          city: userData.address?.city || 'São Paulo',
          state: userData.address?.state || 'SP',
          zipCode: userData.address?.cep || '01310-100',
          isDefault: true
        }
      ],
      paymentCards: [],
      pixKeys: [],
      notifications: {
        whatsapp: true,
        emailOffers: true,
        smsDelivery: true,
        orderUpdates: true
      },
      linkedAccounts: {
        google: true,
        apple: false,
        facebook: false
      },
      loyaltyTier: 'Membro Bronze 🥉',
      cashbackBalance: 15.00
    };

    if (userData.profileType === 'seller') {
      newUser.sellerData = {
        storeName: userData.storeName || 'Loja Pet',
        cnpj: userData.cnpj || '00.000.000/0001-00',
        status: 'active',
        category: 'Pet Shop'
      };
    }

    if (userData.profileType === 'delivery_person') {
      newUser.deliveryData = {
        vehicleType: userData.vehicleType || 'bicycle',
        plate: userData.plate,
        cnhNumber: '00000000000',
        status: 'active'
      };
    }

    this.mockUsers.push(newUser);
    this._currentUser.set(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));

    return true;
  }

  updateProfile(partial: Partial<User>): void {
    const current = this._currentUser();
    if (!current) return;

    const updated = {
      ...current,
      ...partial
    };

    this._currentUser.set(updated);
    localStorage.setItem('user', JSON.stringify(updated));
  }

  switchRole(newRole: UserRole): void {
    const current = this._currentUser();
    if (!current) return;

    const roles = current.enabledRoles || ['buyer'];
    if (!roles.includes(newRole)) {
      roles.push(newRole);
    }

    const updated: User = {
      ...current,
      role: newRole,
      enabledRoles: roles
    };

    this._currentUser.set(updated);
    localStorage.setItem('user', JSON.stringify(updated));
  }

  addAddress(address: UserAddress): void {
    const current = this._currentUser();
    if (!current) return;

    const addresses = [...(current.addresses || [])];
    if (address.isDefault) {
      addresses.forEach(a => a.isDefault = false);
    }
    addresses.push(address);

    this.updateProfile({ addresses });
  }

  removeAddress(id: string): void {
    const current = this._currentUser();
    if (!current) return;

    const addresses = (current.addresses || []).filter(a => a.id !== id);
    if (addresses.length > 0 && !addresses.some(a => a.isDefault)) {
      addresses[0].isDefault = true;
    }

    this.updateProfile({ addresses });
  }

  setDefaultAddress(id: string): void {
    const current = this._currentUser();
    if (!current) return;

    const addresses = (current.addresses || []).map(a => ({
      ...a,
      isDefault: a.id === id
    }));

    this.updateProfile({ addresses });
  }

  addPaymentCard(card: PaymentCard): void {
    const current = this._currentUser();
    if (!current) return;

    const paymentCards = [...(current.paymentCards || [])];
    if (card.isDefault) {
      paymentCards.forEach(c => c.isDefault = false);
    }
    paymentCards.push(card);

    this.updateProfile({ paymentCards });
  }

  removePaymentCard(id: string): void {
    const current = this._currentUser();
    if (!current) return;

    const paymentCards = (current.paymentCards || []).filter(c => c.id !== id);
    if (paymentCards.length > 0 && !paymentCards.some(c => c.isDefault)) {
      paymentCards[0].isDefault = true;
    }

    this.updateProfile({ paymentCards });
  }

  addPixKey(pix: PixKey): void {
    const current = this._currentUser();
    if (!current) return;

    const pixKeys = [...(current.pixKeys || [])];
    if (pix.isDefault) {
      pixKeys.forEach(p => p.isDefault = false);
    }
    pixKeys.push(pix);

    this.updateProfile({ pixKeys });
  }

  removePixKey(id: string): void {
    const current = this._currentUser();
    if (!current) return;

    const pixKeys = (current.pixKeys || []).filter(p => p.id !== id);
    this.updateProfile({ pixKeys });
  }

  addPet(pet: Pet): void {
    const current = this._currentUser();
    if (!current) return;

    const pets = [...(current.pets || []), pet];
    this.updateProfile({ pets });
  }

  removePet(index: number): void {
    const current = this._currentUser();
    if (!current) return;

    const pets = (current.pets || []).filter((_, i) => i !== index);
    this.updateProfile({ pets });
  }

  updatePet(index: number, updatedPet: Pet): void {
    const current = this._currentUser();
    if (!current) return;

    const pets = [...(current.pets || [])];
    if (pets[index]) {
      pets[index] = updatedPet;
      this.updateProfile({ pets });
    }
  }

  updateNotifications(notifications: UserNotifications): void {
    this.updateProfile({ notifications });
  }

  updateLinkedAccounts(linkedAccounts: LinkedAccounts): void {
    this.updateProfile({ linkedAccounts });
  }

  logout(): void {
    this._currentUser.set(null);
    localStorage.removeItem('user');
  }

  requestPasswordReset(identifier: string): boolean {
    if (!identifier || identifier.trim() === '') {
      return false;
    }
    console.log(`[AuthService] Link de recuperação solicitado para: ${identifier}`);
    return true;
  }
}
