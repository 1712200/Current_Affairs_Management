import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NewsService, NewsArticle } from '../news.service';

@Component({
  selector: 'app-current-affairs',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './current-affairs.component.html',
  styleUrls: ['./current-affairs.component.css'],
})
export class CurrentAffairsComponent implements OnInit {
  affairs = signal<NewsArticle[]>([]);
  filteredAffairs = signal<NewsArticle[]>([]);
  showForm = signal(false);

  newAffair: NewsArticle = {
    title: '',
    publishedAt: '',
    description: '',
    url: '',
    category: 'General',
  };

  constructor(private newsService: NewsService) {}

  ngOnInit() {
    this.fetchNews('general'); // default category
  }

  fetchNews(category: string = 'general') {
    this.newsService.getNews(category).subscribe({
      next: (articles) => {
        this.affairs.set(articles);
        this.filteredAffairs.set(articles);
      },
      error: (err) => {
        console.error('Error fetching news:', err);

        // fallback with categories
        const fallback = [
          {
            title: 'Tech Conference',
            publishedAt: '2025-09-27',
            description: 'New AI tools showcased',
            url: '#',
            category: 'Technology',
          },
          {
            title: 'Global Economy Update',
            publishedAt: '2025-09-26',
            description: 'Market trends discussed',
            url: '#',
            category: 'Business',
          },
          {
            title: 'Health Awareness',
            publishedAt: '2025-09-25',
            description: 'New vaccine launched',
            url: '#',
            category: 'Health',
          },
        ];
        this.affairs.set(fallback);
        this.filteredAffairs.set(fallback);
      },
    });
  }

  filterByCategory(category: string) {
    if (category === 'All') {
      this.filteredAffairs.set(this.affairs());
    } else {
      this.filteredAffairs.set(
        this.affairs().filter((a) => a.category === category)
      );
    }
  }

  showAddForm() {
    this.showForm.set(true);
  }
  showAllAffairs() {
    this.showForm.set(false);
  }

  addAffair() {
    if (!this.newAffair.title) return;
    this.affairs.set([...this.affairs(), { ...this.newAffair }]);
    this.filteredAffairs.set(this.affairs());
    this.newAffair = {
      title: '',
      publishedAt: '',
      description: '',
      url: '',
      category: 'General',
    };
    this.showForm.set(false);
  }

  deleteAffair(index: number) {
    const updated = this.affairs().filter((_, i) => i !== index);
    this.affairs.set(updated);
    this.filteredAffairs.set(updated);
  }

  editAffair(article: NewsArticle, index: number) {
    this.newAffair = { ...article };
    this.deleteAffair(index);
    this.showForm.set(true);
  }
}
