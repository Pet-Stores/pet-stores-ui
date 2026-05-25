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

  /**
   * TODO: Integrar com o Backend (Autenticação)
   * 
   * Endpoint esperado: POST /api/auth/login
   * 
   * Dados a enviar (Payload/Request):
   * {
   *   "identifier": "johnny@gmail.com" | "+5541995341904", // E-mail ou número de telefone formatado
   *   "password": "senha_do_usuario"
   * }
   * 
   * Formato de retorno esperado (Response - HTTP 200):
   * {
   *   "token": "JWT_ACCESS_TOKEN_STRING",
   *   "user": {
   *     "id": "string",
   *     "firstName": "string",
   *     "fullName": "string",
   *     "email": "string",
   *     "phone": "string",
   *     "profileImage": "string (URL)"
   *   }
   * }
   * 
   * Erros previstos (HTTP 401 / 400):
   * {
   *   "error": "Credenciais inválidas." // Mensagem opaca para evitar enumeração
   * }
   */
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

  /**
   * TODO: Integrar com o Backend (Logout)
   * 
   * Endpoint esperado: POST /api/auth/logout
   * 
   * Dados a enviar:
   * - Cabeçalho HTTP: Authorization: Bearer JWT_ACCESS_TOKEN_STRING
   * 
   * Formato de retorno esperado (Response - HTTP 204):
   * (Sem conteúdo no corpo)
   */
  logout(): void {
    this._currentUser.set(null);
    localStorage.removeItem('user');
  }

  /**
   * TODO: Integrar com o Backend (Esqueceu sua Senha)
   * 
   * Endpoint esperado: POST /api/auth/forgot-password
   * 
   * Dados a enviar (Payload/Request):
   * {
   *   "identifier": "johnny@gmail.com" | "+5541995341904"
   * }
   * 
   * Formato de retorno esperado (Response - HTTP 200/202):
   * {
   *   "success": true,
   *   "message": "Instruções enviadas se a conta estiver ativa." // Mensagem opaca (Anti-enumeration)
   * }
   */
  requestPasswordReset(identifier: string): boolean {
    if (!identifier || identifier.trim() === '') {
      return false;
    }
    // Lógica mock de envio de recuperação. Retorna true para simular sucesso
    // e manter a resposta opaca (segurança anti-enumeração de contas).
    console.log(`[AuthService] Link de recuperação solicitado para: ${identifier}`);
    return true;
  }
}
