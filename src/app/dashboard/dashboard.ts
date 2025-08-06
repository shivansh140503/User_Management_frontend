import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  view: 'users' | 'activities' = 'users';
  users: any[] = [];
  activities: any[] = [];
  role: string = '';

  constructor(private http: HttpClient, private router: Router) {}

//   ngOnInit() {
//   const jwt = localStorage.getItem('token');
//   if (jwt) {
//     this.role = this.extractRoleFromToken(jwt).toLowerCase();
//     console.log('Extracted Role:', this.role);
//   } else {
//     console.warn('No JWT token found in localStorage');
//   }
//   const role = localStorage.getItem('role')?? '';
//   console.log('Role from localStorage:', role);
//   this.role = role;
// }

  ngOnInit(): void {
    const token = localStorage.getItem('jwt');
    console.log('JWT Token:', token);
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }
    

    const role = localStorage.getItem('role')?? '';
    console.log('Role from localStorage:', role);
    this.role = role;

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    // this.loadUsers(headers);

    if (this.role === 'admin') {
      console.log('print activity');
      this.loadUsers(headers);
      this.loadActivities(headers);
    }

    if (this.role === 'user' || this.role === 'User') {
      console.log('print Current user');
      this.loadCurrentUser(headers);
    }

    
  }

  loadUsers(headers: HttpHeaders): void {
    this.http.get<any[]>('http://localhost:5171/api/User', { headers })
      .subscribe({
        next: data => this.users = data,
        error: err => console.error('Error loading users:', err)
      });
  }

  loadActivities(headers: HttpHeaders): void {
    this.http.get<any[]>('http://localhost:5171/api/UserActivity', { headers })
      .subscribe({
        next: data => {
        // Enrich each activity with fname using the users list
        this.activities = data.map(activity => {
          const user = this.users.find(u => u.userID === activity.userID);
          return {
            ...activity,
            fname: user ? user.fname : 'Unknown'
          };
        });
      },
        error: err => console.error('Error loading activities:', err)
      });
  }

  loadCurrentUser(headers: HttpHeaders): void {
  this.http.get<any>(`http://localhost:5171/api/User`, { headers })
    .subscribe({
      next: data => this.users = [data],  // wrap in array to fit table display
      error: err => console.error('Error loading current user:', err)
    });
}



//   extractRoleFromToken(token: string): string {
//   try {
//     const payload = JSON.parse(atob(token.split('.')[1]));
//     return payload.role || '';
//   } catch (e) {
//     console.error('Failed to extract role from token', e);
//     return '';
//   }
// }

  switchView(selected: string): void {
    this.view = selected as 'users' | 'activities';
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/home']);
  }
}
