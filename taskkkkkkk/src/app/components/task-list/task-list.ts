import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TasksService } from '../../services/tasks.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task } from '../../models/types.model';
import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';
import { CommentsService } from '../../services/comments.service';
import { Comments } from '../comments/comments';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, DragDropModule, Comments],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css'
})
export class TaskList implements OnInit {
  tasksService = inject(TasksService);
  commentsService = inject(CommentsService);
  private route = inject(ActivatedRoute);

  projectId = signal<string>('');
  isCreateOpen = signal(false);
  errorMessage = signal<string | null>(null);

  editingTaskId = signal<string | null>(null);
  selectedTask = signal<Task | null>(null);
  searchQuery = signal('');
  taskForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    priority: new FormControl('normal')
  });

  todoTasks = computed(() => {
    const text = this.searchQuery().toLowerCase(); // הופכים לאותיות קטנות לחיפוש גמיש
    return this.tasksService.myTasks().filter(t =>
      t.status === 'todo' &&
      (t.title.toLowerCase().includes(text) || t.description?.toLowerCase().includes(text))
    );
  });

  inProgressTasks = computed(() => {
    const text = this.searchQuery().toLowerCase();
    return this.tasksService.myTasks().filter(t =>
      t.status === 'in_progress' &&
      (t.title.toLowerCase().includes(text) || t.description?.toLowerCase().includes(text))
    );
  });

  doneTasks = computed(() => {
    const text = this.searchQuery().toLowerCase();
    return this.tasksService.myTasks().filter(t =>
      t.status === 'done' &&
      (t.title.toLowerCase().includes(text) || t.description?.toLowerCase().includes(text))
    );
  });
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('projectId');
    if (id) {
      this.projectId.set(id);
      this.tasksService.loadTasks(id);
    }
  }


  openCreate() {
    this.editingTaskId.set(null);
    this.selectedTask.set(null);
    this.taskForm.reset({ priority: 'normal' });
    this.isCreateOpen.set(true);
    this.commentsService.currentComments.set([]);
  }

  openEdit(task: Task) {
    this.editingTaskId.set(task.id);
    this.selectedTask.set(task);

    this.taskForm.patchValue({
      title: task.title,
      description: task.description,
      priority: task.priority || 'normal'
    });

    this.isCreateOpen.set(true);

    // טעינת תגובות לתוך המשימה הנבחרת
    this.commentsService.loadComments(task.id);
  }

  closeModal() {
    this.isCreateOpen.set(false);
    this.editingTaskId.set(null);
    this.selectedTask.set(null);
    this.taskForm.reset();
    this.commentsService.currentComments.set([]); // נקה את התגובות
  }


  saveTask() {
    if (this.taskForm.invalid) return;

    const { title, description, priority } = this.taskForm.value;
    const currentProjectId = this.projectId();
    const taskId = this.editingTaskId();

    if (taskId) {
      this.tasksService.updateTask(taskId, {
        title,
        description,
        priority
      }).subscribe({
        next: () => this.closeModal()
      });
    }
    else {
      const selectedPriority = priority as 'low' | 'normal' | 'high';
      this.tasksService.addTask(
        currentProjectId,
        title!,
        description!,
        undefined,
        selectedPriority
      ).subscribe({
        next: () => this.closeModal()
      });
    }
  }


  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }
    else {
      const task = event.item.data as Task;
      const newStatus = event.container.id;

      this.tasksService.updateTask(task.id, { status: newStatus }).subscribe({
        next: () => console.log('סטטוס עודכן בגרירה!'),
        error: (err) => {
          console.error('הגרירה נכשלה:', err);
          this.errorMessage.set('שגיאה בעדכון הסטטוס - נסה שוב');
        }
      });
    }
  }


  onDeleteTask(task: Task) {
    const confirmDelete = confirm(`האם למחוק את המשימה "${task.title}"? 🗑️`);
    if (!confirmDelete) return;

    this.tasksService.deleteTask(task.id).subscribe({
      next: () => {
        if (this.editingTaskId() === task.id) {
          this.closeModal();
        }
      },
      error: (err) => {
        console.error('שגיאה במחיקה:', err);
        this.errorMessage.set('שגיאה במחיקת המשימה - נסה שוב');
      }
    });
  }

  onStatusChange(task: Task, event: Event) {
    const newStatus = (event.target as HTMLSelectElement).value;
    this.tasksService.updateTask(task.id, { status: newStatus }).subscribe({
      next: () => console.log('הסטטוס עודכן ידנית'),
      error: (err) => {
        console.error('שגיאה בעדכון הסטטוס:', err);
        this.errorMessage.set('שגיאה בעדכון הסטטוס - נסה שוב');
      }
    });
  }

  onPriorityChange(task: Task, event: Event) {
    const newPriority = (event.target as HTMLSelectElement).value;
    this.tasksService.updateTask(task.id, { priority: newPriority }).subscribe({
      next: () => console.log('העדיפות עודכנה'),
      error: (err) => {
        console.error('שגיאה בעדכון העדיפות:', err);
        this.errorMessage.set('שגיאה בעדכון העדיפות - נסה שוב');
      }
    });
  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
  }
}
