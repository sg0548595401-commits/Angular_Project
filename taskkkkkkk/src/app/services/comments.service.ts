import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Comment } from '../models/types.model';
import { tap, catchError } from 'rxjs';
import { throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/comments`;

  currentComments = signal<Comment[]>([]);
  loadingError = signal<string | null>(null);

  loadComments(taskId: string) {
    this.currentComments.set([]); 
    this.loadingError.set(null);
    
    this.http.get<Comment[]>(`${this.apiUrl}?taskId=${taskId}`).subscribe({
      next: (data) => {
        this.currentComments.set(data); 
      },
      error: (err: HttpErrorResponse) => {
        console.error('שגיאה בטעינת תגובות', err);
        
        if (err.status === 403) {
          this.loadingError.set('אתה לא בעל הרשאה לראות תגובות - יש להיות חבר בצוות הפרויקט');
        } else if (err.status === 401) {
          this.loadingError.set('אתה חייב להיות מחובר');
        } else {
          this.loadingError.set('שגיאה בטעינת תגובות');
        }
      }
    });
  }

  addComment(taskId: string, body: string) {
    const payload = { taskId, body };

    return this.http.post<Comment>(this.apiUrl, payload).pipe(
      tap((newComment) => {
        this.currentComments.update(list => [...list, newComment]);
        this.loadingError.set(null);
      }),
      catchError((err: HttpErrorResponse) => {
        if (err.status === 403) {
          this.loadingError.set('אתה לא בעל הרשאה להוסיף תגובות - יש להיות חבר בצוות הפרויקט');
        } else if (err.status === 401) {
          this.loadingError.set('אתה חייב להיות מחובר');
        } else {
          this.loadingError.set('שגיאה בהוספת תגובה');
        }
        return throwError(() => err);
      })
    );
  }
}