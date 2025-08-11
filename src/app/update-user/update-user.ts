import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './update-user.html',
  styleUrl: './update-user.css'
})

export class UpdateUserComponent implements OnInit {
  username: string = '';
  formVisible: boolean = false;
  role: string = '';
  message: string = '';
  headers!: HttpHeaders;
  prevName: string ='';

  updateData = {
    name: '',
    email: '',
    password: '',
    role: ''
  };

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('jwt');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }
    

    this.role = localStorage.getItem('role')?? '';
     if (this.role.toLowerCase() !== 'admin') {
        alert('Access denied. Admins only');
        this.router.navigate(['/dashboard']);
    }

    this.headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const state = history.state;
    this.username = state.username;
    console.log(history.state);

    if (!this.username) {
        console.log(history.state);
        alert('No username provided');
        this.router.navigate(['/dashboard']);
        return;
    }
    else{
        this.fetchUser();
    }

    // this.username = username.fname; // or user.username, whatever you use
    // this.updateData.email = user.email;
    // this.updateData.role = user.role;
    // this.updateData.password = '';

  }

    fetchUser() {
  this.http.get<any>(`http://localhost:5171/api/AdminUser/${this.username}`,{ headers: this.headers })
    .subscribe({
        next: (data) => {
        this.prevName = data.fname;
        this.updateData.name = data.fname;
        this.updateData.email = data.email;
        this.updateData.role = data.role;
        this.formVisible = true;
        console.log(data);
    },
    error: (err) => {
      console.error('User fetch failed', err);
    }
  });
}


   submitUpdate(): void {
    const body = { 
      name: this.updateData.name,
      email: this.updateData.email,
      password: this.updateData.password,
      role: this.updateData.role
    };
    if (!this.updateData.name) {
    this.updateData.name = this.username; // fallback to old name
  }
    const { name, email, password, role } = this.updateData;

  // Validation: alert if any field is empty
  if (!name || !email || !password || !role) {
    alert('Please fill out all fields before submitting.');
    return;
  }



    this.http.put<any>(`http://localhost:5171/api/AdminUser/update?name=${this.username}`,
    this.updateData,
    { headers: this.headers })
        .subscribe({
        next: (data) =>{
        this.message = 'User Updated';
        this.formVisible = false;
        // this.prevName = data.name;
        this.updateData = {name: '', email: '', password: '', role: ''};
        alert('User Updated successfully');
        this.router.navigate(['/dashboard']);
      },
      error: err => {
        console.error(err);
        this.message = 'User Update Failed';
      }
    });
}
}
