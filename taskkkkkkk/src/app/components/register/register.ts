import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Register {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  errorMsg = signal<string>('');
  isLoading = signal<boolean>(false);
  hidePassword = signal<boolean>(true);
  hideConfirmPassword = signal<boolean>(true);

  registerForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  }, { 
    validators: this.passwordMatchValidator.bind(this)
  });

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading.set(true);
      const { name, email, password } = this.registerForm.value;
      
      this.authService.register({ name, email, password }).subscribe({
        next: () => {
          this.router.navigate(['/teams']);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error(err);
          this.errorMsg.set('אופס! משהו השתבש בהרשמה. אולי המייל כבר קיים?');
          this.isLoading.set(false);
        }
      });
    }
  }

  togglePasswordVisibility() {
    this.hidePassword.update(v => !v);
  }

  toggleConfirmPasswordVisibility() {
    this.hideConfirmPassword.update(v => !v);
  }

  private passwordMatchValidator(group: FormGroup): { [key: string]: any } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }
}