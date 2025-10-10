import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NewsService, NewsArticle } from './news.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
toggleCountry() {
throw new Error('Method not implemented.');
}
  articles: NewsArticle[] = [];
  isMenuOpen = false;

  selectedCountry = 'in'; // default country
  weatherTemp = '--';
  weatherIcon: string = ''; // <-- added to store weather icon URL

  constructor(
    private newsService: NewsService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.fetchWeatherAndAQI(this.selectedCountry);
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
    this.isMenuOpen = false;
  }

  fetchNews(category: string) {
    this.newsService.getNews(category).subscribe({
      next: (data) => (this.articles = data),
      error: (err) => console.error('Error fetching news:', err)
    });
  }

  onCountryChange(event: any) {
    this.selectedCountry = event.target.value;
    this.fetchWeatherAndAQI(this.selectedCountry);
  }

  fetchWeatherAndAQI(countryCode: string) {
    // Map country to city (example)
    const cityMap: any = { in: 'Mumbai', il: 'Tel Aviv' };
    const city = cityMap[countryCode] || 'Mumbai';

    const weatherApiKey = 'adf606600e13e6e55f7641e034ac2638';

    // Fetch weather
    this.http
      .get<any>(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${weatherApiKey}`)
      .pipe(catchError(err => { console.error(err); return of(null); }))
      .subscribe(res => {
        if (res) {
          this.weatherTemp = res.main.temp.toFixed(1);
          // Add icon URL from API
          this.weatherIcon = res.weather && res.weather[0]?.icon
            ? `https://openweathermap.org/img/wn/${res.weather[0].icon}.png`
            : '';
        } else {
          this.weatherTemp = '--';
          this.weatherIcon = '';
        }
      });
  }
}
