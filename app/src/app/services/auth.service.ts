import { Injectable, signal, computed } from '@angular/core';

export interface Pet {
  id?: string;
  name: string;
  species: string;
  birthDate?: string;
  gender?: 'male' | 'female';
  documentName?: string;
}

export interface User {
  id: string;
  firstName: string;
  fullName: string;
  email?: string;
  phone?: string;
  profileImage: string;
  pets?: Pet[];
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
      profileImage: '../../assets/img/perfil-image.jpeg'
    },
    {
      id: '2',
      firstName: 'Johnny',
      fullName: 'Johnny Carvalho',
      phone: '+55 (41) 99534-1904',
      profileImage: '../../assets/img/perfil-image.jpeg'
    }
  ];

  // Current logged in user state
  private _currentUser = signal<User | null>(null);

  // Public computed signals for easier consumption
  public currentUser = computed(() => this._currentUser());
  public isLoggedIn = computed(() => this._currentUser() !== null);
  public userFirstName = computed(() => this._currentUser()?.firstName || 'Perfil');

  constructor() {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      // Upgrade path if it's the old one
      if (user.profileImage === '/assets/img/perfil-image.jpeg' || user.profileImage === 'assets/img/perfil-image.jpeg') {
        user.profileImage = '../../assets/img/perfil-image.jpeg';
        localStorage.setItem('user', JSON.stringify(user));
      }
      this._currentUser.set(user);
    }
  }

  login(identifier: string, password: string): boolean {
    if (password !== '123456') return false;

    const user = this.mockUsers.find(u =>
      u.email === identifier || u.phone === identifier
    );

    if (user) {
      this._currentUser.set(user);
      localStorage.setItem('user', JSON.stringify(user));
      return true;
    }

    return false;
  }

  register(userData: any): boolean {
    console.log('[AuthService] Realizando cadastro mock:', userData);

    // Simula a criação de um novo usuário baseado nos dados
    const newUser: User = {
      id: Math.random().toString(36).substring(2, 9),
      firstName: userData.fullName.split(' ')[0],
      fullName: userData.fullName,
      email: userData.identifier?.includes('@') ? userData.identifier : undefined,
      phone: !userData.identifier?.includes('@') ? userData.identifier : undefined,
      profileImage: '../../assets/img/perfil-image.jpeg',
      pets: userData.pets && userData.pets.length > 0 ? userData.pets : undefined
    };

    // Adiciona ao mock local para permitir login imediato
    this.mockUsers.push(newUser);

    // Loga o usuário automaticamente após o cadastro
    this._currentUser.set(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));

    return true;
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
