import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, 
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    RouterModule, ],
  templateUrl: './form.html',
  styleUrl: './form.css'
})


export class Form {
  user = {
    FNAME: '',
    email: '',
    password: '',
    role: ''
  };

  constructor(private http: HttpClient, private router: Router) {}

  submitForm(formRef: any) {

      if (formRef.invalid) {
      formRef.form.markAllAsTouched(); // highlight errors
      return;
    }
    
    this.http.post('http://localhost:5171/api/User', this.user).subscribe({
      next: res => {
        alert('User created successfully!');
        console.log(res);
        this.router.navigate(['/home']);
      },
      error: err => {
        alert('Error creating user.');
        console.error(err.error);
      }
    });
  }
}
