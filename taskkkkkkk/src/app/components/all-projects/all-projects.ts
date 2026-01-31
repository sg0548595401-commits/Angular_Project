import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ProjectsService } from '../../services/projects.service';

@Component({
  selector: 'app-all-projects',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink], // אין צורך ב-DatePipe כרגע
  templateUrl: './all-projects.html',
  styleUrl: './all-projects.css'
})
export class AllProjectsComponent implements OnInit {
  projectsService = inject(ProjectsService);

  // סיגנל שיחזיק את מילת החיפוש
  searchQuery = signal<string>('');
  
  // שליטה על שדה האינפוט
  searchControl = new FormControl('');

  // --- הקסם קורה כאן ---
  filteredProjects = computed(() => {
    // 1. לוקחים את כל הפרויקטים (שכבר נטענו בסרוויס)
    const all = this.projectsService.myProjects();
    
    // 2. לוקחים את מילת החיפוש (באותיות קטנות כדי למנוע בעיות Case)
    const text = this.searchQuery().toLowerCase();

    // 3. מסננים: אם אין טקסט - מחזירים הכל. אחרת - בודקים אם השם מכיל את הטקסט
    return all.filter(p => p.name.toLowerCase().includes(text));
  });

  ngOnInit() {
    // טוענים את כל הפרויקטים מהשרת (בלי סינון של צוות)
    this.projectsService.loadProjects();
  }

  // פונקציה שתרוץ בכל פעם שמקלידים אות
  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
  }
}