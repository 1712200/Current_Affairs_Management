import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NewsService, NewsArticle } from '../news.service';

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})
export class ArticlesComponent implements OnInit {
  articles = signal<NewsArticle[]>([]);
  filteredArticles = signal<NewsArticle[]>([]);
  myArticles = signal<NewsArticle[]>([]);
  searchQuery = signal('');
  showAddForm = signal(false);

  newArticle: NewsArticle = {
    title: '',
    description: '',
    publishedAt: '',
    url: '',
    category: 'General'
  };

  constructor(private newsService: NewsService) {}

  ngOnInit() {
    this.fetchAllNews();
  }

  fetchAllNews() {
    const categories = ['general', 'business', 'technology', 'sports', 'health', 'science', 'entertainment'];
    Promise.all(categories.map(cat => this.newsService.getNews(cat).toPromise()))
      .then(results => {
        const allArticles = results.flat().filter(Boolean) as NewsArticle[];
        this.articles.set(allArticles);
        this.filteredArticles.set(allArticles);
      })
      .catch(err => console.error(err));
  }

  searchArticles() {
    const query = this.searchQuery().toLowerCase();
    if (!query) {
      this.filteredArticles.set(this.articles());
    } else {
      this.filteredArticles.set(
        this.articles().filter(article =>
          article.title?.toLowerCase().includes(query) ||
          article.description?.toLowerCase().includes(query)
        )
      );
    }
  }

  showForm() {
    this.showAddForm.set(true);
  }

  hideForm() {
    this.showAddForm.set(false);
  }

  addArticle() {
    if (!this.newArticle.title || !this.newArticle.description) return;

    const articleToAdd = {
      ...this.newArticle,
      publishedAt: new Date().toISOString()
    };

    // Add to user articles
    this.myArticles.set([articleToAdd, ...this.myArticles()]);
    // Also add to filtered view
    this.filteredArticles.set([articleToAdd, ...this.filteredArticles()]);

    // Reset form
    this.newArticle = {
      title: '',
      description: '',
      publishedAt: '',
      url: '',
      category: 'General'
    };
    this.showAddForm.set(false);
  }

  deleteMyArticle(index: number) {
  const articleToDelete = this.myArticles()[index];

  // Update myArticles
  const updated = this.myArticles().filter((_, i) => i !== index);
  this.myArticles.set(updated);

  // Update filteredArticles
  const filteredUpdated = this.filteredArticles().filter(a => a !== articleToDelete);
  this.filteredArticles.set(filteredUpdated);
}
}
