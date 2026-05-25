import { Injectable, signal, computed } from '@angular/core';

export interface User {
  id: string;
  firstName: string;
  fullName: string;
  email?: string;
  phone?: string;
  profileImage: string;
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

  logout(): void {
    this._currentUser.set(null);
    localStorage.removeItem('user');
  }
}
