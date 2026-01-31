import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Team } from '../models/types.model';
import { tap } from 'rxjs'; // <--- חובה לייבא את זה

@Injectable({
  providedIn: 'root'
})
export class TeamsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/teams`;

  // ה-State שלנו
  myTeams = signal<Team[]>([]);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  loadTeams() {
    this.isLoading.set(true);
    this.http.get<Team[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.myTeams.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('שגיאה בטעינה');
        this.isLoading.set(false);
      }
    });
  }

  addTeam(name: string) {
    return this.http.post<Team>(this.apiUrl, { name }).pipe(
      tap((newTeam) => {
        this.myTeams.update(currentTeams => [...currentTeams, newTeam]);
      })
    );
  }

  addMemberToTeam(teamId: string, memberName: string) {
    return this.http.post<any>(
      `${this.apiUrl}/${teamId}/members`,
      { memberName: memberName }
    ).pipe(
      tap(() => {
        // עדכן את הצוות בקלינט
        this.myTeams.update(teams =>
          teams.map(team =>
            team.id === teamId
              ? { ...team, members_count: (team.members_count || 0) + 1 }
              : team
          )
        );
      })
    );
  }
}