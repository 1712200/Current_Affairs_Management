import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsService, NewsArticle } from '../news.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  articles: NewsArticle[] = [];
  activeCategory: string = 'general';

  constructor(private newsService: NewsService) {}

  ngOnInit() {
    this.fetchNews('general'); // default
  }

  fetchNews(category: string) {
    this.activeCategory = category;
    this.newsService.getNews(category).subscribe({
      next: (data) => this.articles = data,
      error: (err) => console.error('Error fetching news:', err)
    });
  }
}
