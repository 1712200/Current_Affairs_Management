import { CommonModule } from '@angular/common';
import { Component, OnInit, NgZone } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { NewsService, NewsArticle } from '../news.service';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  articles: NewsArticle[] = [];

  // ✅ For bar chart
  selectedCategory: string | null = null;
  selectedCategoryArticles: NewsArticle[] = [];

  // ✅ For line chart
  selectedDate: string | null = null;
  selectedDateArticles: NewsArticle[] = [];

  // ✅ For active authors pie chart
  selectedAuthor: string | null = null;
  selectedAuthorArticles: NewsArticle[] = [];

  categoryArticles: { [key: string]: NewsArticle[] } = {};
  dateArticles: { [key: string]: NewsArticle[] } = {};
  authorArticles: { [key: string]: NewsArticle[] } = {};

  // --- Charts ---
  categoryChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  latestChartData: ChartData<'line'> = { labels: [], datasets: [] };
  totalArticlesChartData: ChartData<'doughnut'> = { labels: [], datasets: [] };
  activeAuthorsChartData: ChartData<'pie'> = { labels: [], datasets: [] };
  monthlyViewsChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  avgReadTimeChartData: ChartData<'radar'> = { labels: [], datasets: [] };
  engagementRateChartData: ChartData<'doughnut'> = { labels: [], datasets: [] };
  sentimentDistributionChartData: ChartData<'polarArea'> = { labels: [], datasets: [] };
  authorProductivityChartData: ChartData<'bubble'> = { labels: [], datasets: [] };
  articleLengthChartData: ChartData<'scatter'> = { datasets: [] };
  categoryImageChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  popularityIndexChartData: ChartData<'radar'> = { labels: [], datasets: [] };
  articleLengthChartOptions: ChartOptions = {};
  categoryImageChartOptions: ChartOptions = {};



  // --- Chart Options ---
  defaultChartOptions: ChartOptions = {
    responsive: true,
    plugins: { legend: { display: true } }
  };

  // ✅ Category Bar Chart Options
  categoryChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      title: { display: true, text: 'Articles per Category', font: { size: 16 } },
      
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => {
            const category = this.categoryChartData.labels?.[tooltipItem.dataIndex];
            const count = tooltipItem.raw;
            return `${category}: ${count} articles`;
          }
        }
      }
    },
    onClick: (event: any, chartElements: any) => {
      if (chartElements.length > 0) {
        const index = chartElements[0].index;
        const category = this.categoryChartData.labels?.[index]?.toString();
        if (category) {
          this.ngZone.run(() => {
            
            this.selectedDate = null;
            this.selectedDateArticles = [];
            this.selectedAuthor = null;
            this.selectedAuthorArticles = [];

            // Set category selection
            this.selectedCategory = category;
            this.selectedCategoryArticles = this.categoryArticles[category] || [];
          });
        }
      }
    }
  };

  // ✅ Line Chart Options
  lineChartOptions: ChartOptions = {
    responsive: true,
    plugins: {title: { display: true, text: 'Articles Over Time', font: { size: 16 } },
       },
    onClick: (event: any, chartElements: any) => {
      if (chartElements.length > 0) {
        const index = chartElements[0].index;
        const date = this.latestChartData.labels?.[index]?.toString();
        if (date) {
          this.ngZone.run(() => {
            // Clear other selections
            this.selectedCategory = null;
            this.selectedCategoryArticles = [];
            this.selectedAuthor = null;
            this.selectedAuthorArticles = [];

            // Set date selection
            this.selectedDate = date;
            this.selectedDateArticles = this.dateArticles[date] || [];
          });
        }
      }
    }
  };

  // ✅ Active Authors Pie Chart Options
  pieChartOptions: ChartOptions = {
    responsive: true,
    plugins: { 
      title: { display: true, text: 'Top Active Authors', font: { size: 16 } },
      legend: { display: true } },
    onClick: (event: any, chartElements: any) => {
      if (chartElements.length > 0) {
        const index = chartElements[0].index;
        const author = this.activeAuthorsChartData.labels?.[index]?.toString();
        if (author) {
          this.ngZone.run(() => {
            // Clear other selections
            this.selectedCategory = null;
            this.selectedCategoryArticles = [];
            this.selectedDate = null;
            this.selectedDateArticles = [];

            // Set author selection
            this.selectedAuthor = author;
            this.selectedAuthorArticles = this.authorArticles[author] || [];
          });
        }
      }
    }
  };

  constructor(private newsService: NewsService, private ngZone: NgZone) {}

  async ngOnInit() {
    const categories = ['general','business','technology','sports','health','science','entertainment'];

    const hardcodedArticles: NewsArticle[] = [
      { title: 'Tech News 1', author: 'Alice', description: 'Tech article', urlToImage: 'img1.jpg', publishedAt: '2025-10-01' },
      { title: 'Business News 1', author: 'Bob', description: 'Business article', urlToImage: 'img2.jpg', publishedAt: '2025-10-02' },
      { title: 'Tech News 2', author: 'Alice', description: 'Tech article 2', urlToImage: 'img3.jpg', publishedAt: '2025-10-03' },
      { title: 'Health News 1', author: 'Carol', description: 'Health article', urlToImage: '', publishedAt: '2025-10-01' },
    ];

    
    try {
      const results = await Promise.all(
        categories.map(cat => this.newsService.getNews(cat).toPromise())
      );

      this.articles = [...hardcodedArticles, ...results.flat().filter(Boolean) as NewsArticle[]];

      
      // --- Category -> Articles mapping ---
      this.categoryArticles = {};
      categories.forEach((cat, i) => {
        const label = cat.charAt(0).toUpperCase() + cat.slice(1);
        const apiArticles = results[i] || [];
        const hardArticles = hardcodedArticles.filter(a => a.title.toLowerCase().includes(cat));
        this.categoryArticles[label] = [...hardArticles, ...apiArticles];
      });

      // --- Category Chart ---
      this.categoryChartData = {
        labels: Object.keys(this.categoryArticles),
        datasets: [{
          label: 'Articles per Category',
          data: Object.values(this.categoryArticles).map(list => list.length),
          backgroundColor: ['#12467eff','#28a745','#ffc107','#dc3545','#17a2b8','#6f42c1','#fd7e14']
        }]
      };

      // --- Date -> Articles mapping ---
      this.dateArticles = {};
      this.articles.forEach(a => {
        const day = new Date(a.publishedAt!).toLocaleDateString();
        if (!this.dateArticles[day]) this.dateArticles[day] = [];
        this.dateArticles[day].push(a);
      });

      // --- Line Chart ---
      this.latestChartData = {
        labels: Object.keys(this.dateArticles),
        datasets: [{
          label: 'Articles Over Time',
          data: Object.values(this.dateArticles).map(list => list.length),
          borderColor: '#28a745',
          backgroundColor: 'rgba(40,167,69,0.2)',
          fill: true,
          tension: 0.3,
          pointBackgroundColor: '#28a745'
        }]
      };

      // --- Active Authors mapping ---
const authors = Array.from(new Set(this.articles.map(a => a.author).filter(Boolean))) as string[]; // ensures string[]
this.authorArticles = {};
authors.forEach(author => {
  if (author) {  // ✅ ensure author is not undefined
    this.authorArticles[author] = this.articles.filter(a => a.author === author);
  }
});


      // --- Active Authors Pie Chart ---
this.activeAuthorsChartData = {
  labels: authors.slice(0, 5),
  datasets: [{
    label: 'Active Authors',
    data: authors.slice(0, 5).map(name => this.authorArticles[name]?.length || 0),
    backgroundColor: ['#ff6384','#36a2eb','#ffce56','#4bc0c0','#9966ff']
  }]
};

      // --- Total Articles ---
      this.totalArticlesChartData = {
        labels: ['Articles'],
        datasets: [{ label: 'Total Articles', data: [this.articles.length], backgroundColor: ['#007bff'] }]
      };

      // --- Monthly Page Views ---
      const monthly: { [key: string]: number } = {};
      this.articles.forEach(a => {
        const month = new Date(a.publishedAt!).toLocaleString('default', { month: 'short', year: 'numeric' });
        monthly[month] = (monthly[month] || 0) + 50;
      });
      this.monthlyViewsChartData = {
        labels: Object.keys(monthly),
        datasets: [{ label: 'Monthly Page Views', data: Object.values(monthly), backgroundColor: '#17a2b8' }]
      };

      // --- Avg. Read Time ---
      const avgReadTimes = categories.map(cat => {
        const catArticles = this.articles.filter(a => a.title.toLowerCase().includes(cat));
        return catArticles.length > 0 ? (catArticles.length * 3) / catArticles.length : 0;
      });
      this.avgReadTimeChartData = {
        labels: categories.map(c => c.charAt(0).toUpperCase() + c.slice(1)),
        datasets: [{ label: 'Avg. Read Time (min)', data: avgReadTimes, backgroundColor: 'rgba(255,99,132,0.2)', borderColor: '#ff6384' }]
      };

      // --- Engagement Rate ---
      const engaging = this.articles.filter(a => a.urlToImage && a.description).length;
      const engagementRate = (engaging / this.articles.length) * 100;
      this.engagementRateChartData = {
        labels: ['Engaged', 'Not Engaged'],
        datasets: [{ label: 'Engagement Rate', data: [engagementRate, 100 - engagementRate], backgroundColor: ['#28a745', '#dc3545'] }]
      };

      // --- Sentiment Distribution (Polar Area Chart) ---
const sentiments = ['Positive', 'Neutral', 'Negative'];
const sentimentCounts = [45, 30, 25]; // Dummy data
this.sentimentDistributionChartData = {
  labels: sentiments,
  datasets: [{
    label: 'Sentiment Distribution',
    data: sentimentCounts,
    backgroundColor: ['#28a745', '#ffc107', '#dc3545']
  }]
};

// --- Author Productivity (Bubble Chart) ---
this.authorProductivityChartData = {
  labels: ['Authors'],
  datasets: authors.map((author, i) => ({
    label: author,
    data: [{ x: i + 1, y: this.authorArticles[author]?.length || 0, r: (this.authorArticles[author]?.length || 1) * 3 }],
    backgroundColor: ['#36a2eb', '#ff6384', '#4bc0c0', '#9966ff', '#ff9f40'][i % 5]
  }))
};

// --- Article Length vs Date (Scatter Chart) ---
this.articleLengthChartData = {
  datasets: [{
    label: 'Article Length vs Date',
    data: this.articles.map(a => ({
      x: new Date(a.publishedAt!).getTime(),
      y: (a.description?.length || 100) / 10
    })),
    backgroundColor: '#17a2b8'
  }]
};

// --- Category Image Chart (Stacked Bar) ---
const withImageCounts = Object.values(this.categoryArticles).map(list => list.filter(a => a.urlToImage).length);
const withoutImageCounts = Object.values(this.categoryArticles).map(list => list.filter(a => !a.urlToImage).length);
this.categoryImageChartData = {
  labels: Object.keys(this.categoryArticles),
  datasets: [
    { label: 'With Image', data: withImageCounts, backgroundColor: '#007bff' },
    { label: 'Without Image', data: withoutImageCounts, backgroundColor: '#6c757d' }
  ]
};

// --- Popularity Index (Radar Chart) ---
const popularityScores = categories.map(() => Math.floor(Math.random() * 100));
this.popularityIndexChartData = {
  labels: categories.map(c => c.charAt(0).toUpperCase() + c.slice(1)),
  datasets: [{
    label: 'Popularity Index',
    data: popularityScores,
    backgroundColor: 'rgba(54,162,235,0.2)',
    borderColor: '#36a2eb'
  }]
};

this.categoryImageChartOptions = {
  responsive: true,
  plugins: { legend: { display: true } },
  scales: { x: { stacked: true }, y: { stacked: true } }
};

this.articleLengthChartOptions = {
  responsive: true,
  plugins: { legend: { display: true } },
  scales: {
    x: { title: { display: true, text: 'Publication Date' }, type: 'linear' },
    y: { title: { display: true, text: 'Article Length (approx)' } }
  }
};



    } catch (err) {
      console.error('Error fetching news for statistics:', err);
    }
  }

  closeList() {
    this.selectedCategory = null;
    this.selectedCategoryArticles = [];
    this.selectedDate = null;
    this.selectedDateArticles = [];
    this.selectedAuthor = null;
    this.selectedAuthorArticles = [];
  }

}
