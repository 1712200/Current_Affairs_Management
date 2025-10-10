import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface NewsArticle {
  title: string;
  description: string;
  publishedAt: string;
  category?: string;
  url?: string;
  author?: string;
  urlToImage?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private apiKey = '4d94649582c7407e913797b2719f9054';

  constructor(private http: HttpClient) {}

  getNews(category: string): Observable<NewsArticle[]> {
    const apiUrl = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${this.apiKey}`;
    return this.http.get<{ articles: any[] }>(apiUrl).pipe(
      map(response =>
        response.articles.map(article => ({
          title: article.title,
          description: article.description,
          publishedAt: article.publishedAt,
          url: article.url,
          category,
          author: article.author,
          urlToImage: article.urlToImage
        }))
      )
    );
  }
}
