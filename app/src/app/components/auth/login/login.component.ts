import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth.service';

interface CountryData {
  code: string;
  prefix: string;
  flag: string;
  mask: string;
  regex: RegExp;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  public dialogRef = inject(MatDialogRef<LoginComponent>);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  loginForm: FormGroup;
  hidePassword = true;
  loginError = signal<string | null>(null);
  
  // Lista de países suportados
  private countries: CountryData[] = [
    { code: 'BR', prefix: '+55', flag: '🇧🇷', mask: '+55 (00) 00000-0000', regex: /^\+?55/ },
    { code: 'US', prefix: '+1', flag: '🇺🇸', mask: '+1 (000) 000-0000', regex: /^\+?1/ },
    { code: 'PT', prefix: '+351', flag: '🇵🇹', mask: '+351 000 000 000', regex: /^\+?351/ },
    { code: 'AR', prefix: '+54', flag: '🇦🇷', mask: '+54 0 000 000-0000', regex: /^\+?54/ },
    { code: 'ES', prefix: '+34', flag: '🇪🇸', mask: '+34 000 000 000', regex: /^\+?34/ },
    { code: 'GB', prefix: '+44', flag: '🇬🇧', mask: '+44 0000 000000', regex: /^\+?44/ },
  ];

  isPhoneMode = signal(false);
  selectedCountry = signal<CountryData>(this.countries[0]); // Default BR

  constructor() {
    this.loginForm = this.fb.group({
      emailOrPhone: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.loginForm.get('emailOrPhone')?.valueChanges.subscribe(value => {
      this.detectInputType(value);
      this.loginError.set(null);
    });
    
    this.loginForm.get('password')?.valueChanges.subscribe(() => {
      this.loginError.set(null);
    });
  }

  detectInputType(value: string): void {
    if (!value || value.trim() === '') {
      this.isPhoneMode.set(false);
      this.selectedCountry.set(this.countries[0]); // Reset to BR
      if (value !== '') {
        this.loginForm.get('emailOrPhone')?.setValue('', { emitEvent: false });
      }
      return;
    }

    const isPhone = /^[+\d]/.test(value);
    
    if (isPhone) {
      this.isPhoneMode.set(true);
      
      const cleaned = value.replace(/\D/g, '');
      const foundCountry = this.countries.find(c => cleaned.startsWith(c.prefix.replace('+', '')));
      
      if (foundCountry) {
        this.selectedCountry.set(foundCountry);
      } else if (cleaned.length > 3) {
        this.selectedCountry.set({ code: 'GEN', prefix: '+', flag: '🌐', mask: '+000000000000', regex: /^\+/ });
      }

      if (/^\d/.test(value)) {
        const matchingPrefix = this.countries.find(c => value.startsWith(c.prefix.replace('+', '')));
        if (matchingPrefix) {
          const newValue = '+' + value;
          this.loginForm.get('emailOrPhone')?.setValue(newValue, { emitEvent: false });
          this.applyPhoneMask(newValue);
          return;
        }
      }
      
      this.applyPhoneMask(value);
    } else {
      this.isPhoneMode.set(false);
    }
  }

  applyPhoneMask(value: string): void {
    if (!this.isPhoneMode()) return;

    const country = this.selectedCountry();
    const cleaned = value.replace(/\D/g, '');
    let finalValue = value;

    if (country.code === 'BR') {
      if (cleaned.startsWith('55')) {
        let digits = cleaned.substring(2);
        let masked = '+55';
        if (digits.length > 0) masked += ' (' + digits.substring(0, 2);
        if (digits.length > 2) masked += ') ' + digits.substring(2, 7);
        if (digits.length > 7) masked += '-' + digits.substring(7, 11);
        finalValue = masked;
      }
    } else if (country.code === 'US') {
      if (cleaned.startsWith('1')) {
        let digits = cleaned.substring(1);
        let masked = '+1';
        if (digits.length > 0) masked += ' (' + digits.substring(0, 3);
        if (digits.length > 3) masked += ') ' + digits.substring(3, 6);
        if (digits.length > 6) masked += '-' + digits.substring(6, 10);
        finalValue = masked;
      }
    } else if (country.code === 'PT') {
      if (cleaned.startsWith('351')) {
        let digits = cleaned.substring(3);
        let masked = '+351';
        if (digits.length > 0) masked += ' ' + digits.substring(0, 3);
        if (digits.length > 3) masked += ' ' + digits.substring(3, 6);
        if (digits.length > 6) masked += ' ' + digits.substring(6, 9);
        finalValue = masked;
      }
    } else if (country.code === 'AR') {
      if (cleaned.startsWith('54')) {
        let digits = cleaned.substring(2);
        let masked = '+54';
        if (digits.length > 0) masked += ' ' + digits.substring(0, 1);
        if (digits.length > 1) masked += ' ' + digits.substring(1, 4);
        if (digits.length > 4) masked += ' ' + digits.substring(4, 7);
        if (digits.length > 7) masked += '-' + digits.substring(7, 11);
        finalValue = masked;
      }
    }

    if (finalValue !== value) {
      this.loginForm.get('emailOrPhone')?.setValue(finalValue, { emitEvent: false });
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { emailOrPhone, password } = this.loginForm.value;
      const success = this.authService.login(emailOrPhone, password);

      if (success) {
        this.snackBar.open('Login realizado com sucesso!', 'Fechar', {
          duration: 4000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
        this.dialogRef.close(true);
      } else {
        // Mensagem genérica por segurança (Best Practice)
        this.snackBar.open('E-mail, telefone ou senha incorretos.', 'Tentar novamente', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
        this.loginError.set('Credenciais inválidas.');
      }
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  loginWithGoogle(): void {
    console.log('Login with Google initiated');
  }

  goToRegister(): void {
    this.dialogRef.close('register');
  }
}
