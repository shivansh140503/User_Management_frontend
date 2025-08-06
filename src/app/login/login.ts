import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    RouterModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})

export class Login {
  credentials = {
    email: '',
    password: ''
  };

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    this.http.post<any>('http://localhost:5171/api/Auth/login', this.credentials).subscribe({
      next: res => {
        const token = res.token;
        const role = res.role;
        localStorage.setItem('jwt', res.token); // ✅ store JWT
        localStorage.setItem('role', res.role);
        alert('Login successful!');
        this.router.navigate(['/dashboard']); // or wherever you want
      },
      error: err => {
        alert('Invalid credentials');
        console.error(err);
      }
    });
  }
}
