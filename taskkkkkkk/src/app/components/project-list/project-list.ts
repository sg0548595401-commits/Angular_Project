import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute , RouterLink} from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProjectsService } from '../../services/projects.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  templateUrl: './project-list.html',
  styleUrl: './project-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectList implements OnInit {
  projectsService = inject(ProjectsService);
  route = inject(ActivatedRoute);

  currentTeamId = signal<string>('');
  
  isCreateOpen = signal(false);

  projectForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('')
  });

  teamProjects = computed(() => {
    const allProjects = this.projectsService.myProjects();
    const teamId = this.currentTeamId();
    return allProjects.filter(p => String(p.team_id) === String(teamId));
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('team_id');
    if (id) {
      this.currentTeamId.set(id);
    }

    this.projectsService.loadProjects();
  }

  toggleCreate() {
    this.isCreateOpen.update(v => !v);
  }

  createProject() {
    if (this.projectForm.invalid) return;

    const { name, description } = this.projectForm.value;
    const teamId = this.currentTeamId();

    this.projectsService.addProject(teamId, name!, description!).subscribe({
      next: () => {
        this.projectForm.reset(); 
        this.isCreateOpen.set(false); 
      },
      error: (err) => console.error('שגיאה ביצירת הפרויקט:', err)
    });
  }
}