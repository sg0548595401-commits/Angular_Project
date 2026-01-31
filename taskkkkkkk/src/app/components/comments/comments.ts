import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommentsService } from '../../services/comments.service';
import { Task } from '../../models/types.model';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './comments.html',
  styleUrl: './comments.css',
})
export class Comments {
  @Input() selectedTask: Task | null = null;
  
  commentsService = inject(CommentsService);
  commentControl = new FormControl('');

  sendComment() {
    if (!this.commentControl.value || !this.selectedTask) return;

    const body = this.commentControl.value;
    const taskId = this.selectedTask.id;

    this.commentsService.addComment(taskId, body).subscribe({
      next: () => {
        this.commentControl.reset();
      },
      error: (err) => {
        // ההודעה כבר מוגדרת ב-service
        console.error('שגיאה בשליחת תגובה', err);
      }
    });
  }
}
