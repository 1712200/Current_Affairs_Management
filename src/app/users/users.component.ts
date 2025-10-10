import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService, User } from '../services/users.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: User[] = [];

  currentUser: User = { name: '', email: '', mobile: '', department: '', role: '', work_location: '' };
  editingUser: User | null = null;
  errorMessage: string = '';

  constructor(private usersService: UsersService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.usersService.getUsers().subscribe({
      next: data => this.users = data,
      error: err => console.error('Error loading users', err)
    });
  }

  addUser() {
    if (!this.currentUser.name || !this.currentUser.email) {
      this.errorMessage = 'Name and Email are required';
      return;
    }

    this.usersService.addUser(this.currentUser).subscribe({
      next: () => {
        this.loadUsers();
        this.resetForm();
      },
      error: err => {
        console.error('Error adding user', err);
        this.errorMessage = err.error?.error || 'Server error while adding user';
      }
    });
  }

  editUser(user: User) {
    this.editingUser = { ...user };
    this.currentUser = { ...user };
    this.errorMessage = '';
  }

  updateUser() {
    if (this.editingUser && this.editingUser.id !== undefined) {
      this.usersService.updateUser(this.editingUser.id, this.currentUser).subscribe({
        next: () => {
          this.loadUsers();
          this.cancelEdit();
        },
        error: err => {
          console.error('Error updating user', err);
          this.errorMessage = err.error?.error || 'Server error while updating user';
        }
      });
    }
  }

  deleteUser(id?: number) {
    if (!id) return;
    this.usersService.deleteUser(id).subscribe({
      next: () => this.loadUsers(),
      error: err => console.error('Error deleting user', err)
    });
  }

  cancelEdit() {
    this.editingUser = null;
    this.resetForm();
  }

  resetForm() {
    this.currentUser = { name: '', email: '', mobile: '', department: '', role: '', work_location: '' };
    this.errorMessage = '';
  }
}
