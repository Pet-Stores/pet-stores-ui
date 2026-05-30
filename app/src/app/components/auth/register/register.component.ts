import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSnackBarModule
  ]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<RegisterComponent>);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  // Estados com Signals
  public currentStep = signal<number>(1);
  public selectedProfile = signal<'buyer' | 'seller' | 'delivery_person'>('buyer');
  public hidePassword = signal<boolean>(true);
  public hideConfirmPassword = signal<boolean>(true);

  // Formulário Reativo
  public registerForm: FormGroup = this.fb.group({
    profileType: ['buyer', Validators.required],
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    identifier: ['', [Validators.required, this.smartIdentifierValidator]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
    
    // Campos Etapa 2 - Vendedor
    storeName: [''],
    cnpj: [''],
    address: this.fb.group({
      cep: [''],
      logradouro: [''],
      number: [''],
      city: [''],
      state: ['']
    }),

    // Campos Etapa 2 - Entregador
    cpf: [''],
    vehicleType: ['bicycle'],
    plate: ['']
  }, { validators: this.passwordMatchValidator });

  // Mock de arquivos selecionados
  public documents = signal<string[]>([]);

  constructor() {
    // Escutar mudanças no perfil para ajustar validadores se necessário
    this.registerForm.get('profileType')?.valueChanges.subscribe(value => {
      this.selectedProfile.set(value);
      this.updateConditionalValidators(value);
    });
  }

  // Validador de Identificador Inteligente (E-mail ou Telefone)
  private smartIdentifierValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^\+?[0-9\s-]{8,20}$/;

    if (emailRegex.test(value) || phoneRegex.test(value)) {
      return null;
    }

    return { invalidIdentifier: true };
  }

  // Validador de Senhas Iguais
  private passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  private updateConditionalValidators(profile: string) {
    // Resetar validadores de campos específicos
    const sellerFields = ['storeName', 'cnpj'];
    const deliveryFields = ['cpf'];

    [...sellerFields, ...deliveryFields].forEach(field => {
      this.registerForm.get(field)?.clearValidators();
      this.registerForm.get(field)?.updateValueAndValidity();
    });

    if (profile === 'seller') {
      this.registerForm.get('storeName')?.setValidators([Validators.required]);
      this.registerForm.get('cnpj')?.setValidators([Validators.required]);
    } else if (profile === 'delivery_person') {
      this.registerForm.get('cpf')?.setValidators([Validators.required]);
    }
  }

  public setProfile(profile: 'buyer' | 'seller' | 'delivery_person') {
    this.registerForm.get('profileType')?.setValue(profile);
  }

  public nextStep() {
    if (this.currentStep() === 1) {
      // Validar etapa 1
      const step1Fields = ['fullName', 'identifier', 'password', 'confirmPassword'];
      let isValid = true;
      step1Fields.forEach(field => {
        const control = this.registerForm.get(field);
        if (control?.invalid) {
          control.markAsTouched();
          isValid = false;
        }
      });

      if (this.registerForm.hasError('passwordMismatch')) {
        isValid = false;
      }

      if (!isValid) return;

      if (this.selectedProfile() === 'buyer') {
        this.onSubmit();
      } else {
        this.currentStep.set(2);
      }
    }
  }

  public prevStep() {
    this.currentStep.set(1);
  }

  public onFileUpload(event: any, docType: string) {
    const file = event.target.files[0];
    if (file) {
      this.documents.update(docs => [...docs, `${docType}: ${file.name}`]);
    }
  }

  public onSubmit() {
    if (this.registerForm.valid) {
      const success = this.authService.register(this.registerForm.value);
      if (success) {
        this.snackBar.open('Cadastro realizado com sucesso!', 'Fechar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.dialogRef.close('success');
      }
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  public goToLogin() {
    this.dialogRef.close('login');
  }

  public close() {
    this.dialogRef.close();
  }
}
