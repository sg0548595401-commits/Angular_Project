import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router'; 
import { AuthService } from './services/auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet, 
    RouterLink, 
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  authService = inject(AuthService);
  title = 'task-manager';
  isMobileMenuOpen = signal(false);

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(v => !v);
  }

  closeMobileMenu() {
    this.isMobileMenuOpen.set(false);
  }

  cleanUserName(name?: string): string {
    if (!name) return 'אורח';
    
    // אם השם משובש לחלוטין, חלץ מהאימייל
    const user = this.authService.currentUser();
    if (user?.email) {
      const emailPrefix = user.email.split('@')[0];
      return emailPrefix || 'אורח';
    }
    
    // אחרת נקה תווים לא תקיניים
    const cleaned = name.replace(/[^א-ת0-9a-zA-Z\s]/g, '').trim();
    return cleaned || 'אורח';
  }
}