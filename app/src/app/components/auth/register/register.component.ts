import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService, Pet } from '../../../services/auth.service';

export interface CatalogedSpecies {
  id: string;
  name: string;
  scientificName?: string;
  icon: string;
}

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

  // Catálogo oficial de espécies
  public readonly catalogedSpecies: CatalogedSpecies[] = [
    { id: 'dog', name: 'Cão / Cachorro', scientificName: 'Canis lupus familiaris', icon: 'pets' },
    { id: 'cat', name: 'Gato', scientificName: 'Felis catus', icon: 'pets' },
    { id: 'bird', name: 'Pássaro / Ave', scientificName: 'Calopsita, Canário, etc.', icon: 'flutter_dash' },
    { id: 'fish', name: 'Peixe Ornamental', scientificName: 'Betta, Tetra, Acará, etc.', icon: 'water' },
    { id: 'rodent', name: 'Roedor', scientificName: 'Hamster, Porquinho-da-Índia, etc.', icon: 'cruelty_free' },
    { id: 'rabbit', name: 'Coelho / Lebre', scientificName: 'Lagomorpha', icon: 'cruelty_free' },
    { id: 'reptile', name: 'Réptil', scientificName: 'Tartaruga, Jabuti, Iguana, etc.', icon: 'pest_control' },
    { id: 'ferret', name: 'Furão / Ferret', scientificName: 'Mustela putorius furo', icon: 'pets' },
    { id: 'amphibian', name: 'Anfíbio', scientificName: 'Sapo, Rã, Salamandra', icon: 'eco' },
    { id: 'other', name: 'Outros Animais Catalogados', scientificName: 'Espécies autorizadas', icon: 'category' }
  ];

  // Data máxima para nascimento (hoje)
  public readonly maxBirthDate = new Date().toISOString().split('T')[0];

  // Estados com Signals
  public currentStep = signal<number>(1);
  public selectedProfile = signal<'buyer' | 'seller' | 'delivery_person'>('buyer');
  public hidePassword = signal<boolean>(true);
  public hideConfirmPassword = signal<boolean>(true);
  public showPetSection = signal<boolean>(false);

  // Formulário Reativo
  public registerForm: FormGroup = this.fb.group({
    profileType: ['buyer', Validators.required],
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    identifier: ['', [Validators.required, this.smartIdentifierValidator]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
    
    // Cadastro de Pets (Opcional - FormArray)
    pets: this.fb.array([]),

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

  // Mock de arquivos selecionados para vendedor/entregador
  public documents = signal<string[]>([]);

  constructor() {
    // Escutar mudanças no perfil para ajustar validadores se necessário
    this.registerForm.get('profileType')?.valueChanges.subscribe(value => {
      this.selectedProfile.set(value);
      this.updateConditionalValidators(value);
    });
  }

  // Getter para FormArray de Pets
  public get pets(): FormArray {
    return this.registerForm.get('pets') as FormArray;
  }

  // Criação de FormGroup para um Pet
  private createPetGroup(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      species: ['', Validators.required],
      birthDate: [''],
      gender: ['male', Validators.required],
      documentName: ['']
    });
  }

  // Adicionar Pet
  public addPet(): void {
    this.showPetSection.set(true);
    this.pets.push(this.createPetGroup());
  }

  // Remover Pet
  public removePet(index: number): void {
    this.pets.removeAt(index);
    if (this.pets.length === 0) {
      this.showPetSection.set(false);
    }
  }

  // Upload de Documento do Pet (vacina, pedigree, RGA, etc.)
  public onPetDocumentUpload(event: any, index: number): void {
    const file = event.target?.files?.[0];
    if (file) {
      const petGroup = this.pets.at(index) as FormGroup;
      petGroup.patchValue({
        documentName: file.name
      });
    }
  }

  // Remover Documento do Pet
  public removePetDocument(index: number): void {
    const petGroup = this.pets.at(index) as FormGroup;
    petGroup.patchValue({
      documentName: ''
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

      // Se o usuário adicionou pets, validar campos dos pets
      if (this.pets.length > 0 && this.pets.invalid) {
        this.pets.markAllAsTouched();
        isValid = false;
      }

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
    // Filtrar pets caso estejam vazios
    const rawValue = this.registerForm.value;
    const cleanPets = (rawValue.pets || []).filter((pet: any) => pet.name && pet.name.trim() !== '');

    const payload = {
      ...rawValue,
      pets: cleanPets
    };

    if (this.registerForm.valid) {
      const success = this.authService.register(payload);
      if (success) {
        const petCount = cleanPets.length;
        const msg = petCount > 0
          ? `Cadastro realizado com sucesso! ${petCount} pet(s) cadastrado(s) 🐾`
          : 'Cadastro realizado com sucesso!';

        this.snackBar.open(msg, 'Fechar', {
          duration: 3500,
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
