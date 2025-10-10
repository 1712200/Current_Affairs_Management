import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.css']
})
export class HeaderComponent {
  menuOpen = false;

  @Output() categorySelected = new EventEmitter<string>();

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  selectCategory(category: string) {
    this.categorySelected.emit(category);
  }
}
