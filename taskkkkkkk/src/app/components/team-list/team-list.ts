import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { TeamsService } from '../../services/teams.service';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { Team } from '../../models/types.model';

@Component({
  selector: 'app-team-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    CommonModule
  ],
  templateUrl: './team-list.html',
  styleUrl: './team-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamList implements OnInit {
  public teamsService = inject(TeamsService);

  newTeamNameControl = new FormControl('', [Validators.required, Validators.minLength(2)]);
  isCreateOpen = signal(false);
  errorMessage = signal<string | null>(null);

  ngOnInit() {
    this.teamsService.loadTeams();
  }

  toggleCreate() {
    this.isCreateOpen.update(value => !value);
    if (!this.isCreateOpen()) {
      this.newTeamNameControl.reset();
    }
  }

  createNewTeam() {
    if (this.newTeamNameControl.invalid) return;
    const name = this.newTeamNameControl.value!;

    this.teamsService.addTeam(name).subscribe({
      next: () => {
        this.newTeamNameControl.reset();
        this.isCreateOpen.set(false);
      },
      error: (err) => {
        console.error('שגיאה ביצירת הצוות:', err);
        this.errorMessage.set('שגיאה ביצירת הצוות - נסה שוב');
      }
    });
  }
}
