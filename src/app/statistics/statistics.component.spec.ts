import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { StatisticsComponent } from './statistics.component';
import { NewsService, NewsArticle } from '../news.service';
import { of } from 'rxjs';
import { NgZone } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('StatisticsComponent', () => {
  let component: StatisticsComponent;
  let fixture: ComponentFixture<StatisticsComponent>;
  let newsService: jasmine.SpyObj<NewsService>;
  let ngZone: NgZone;

  const mockArticles: NewsArticle[] = [
    { title: 'Tech News 1', author: 'Alice', description: 'Desc 1', urlToImage: 'img1.jpg', publishedAt: '2025-10-01' },
    { title: 'Business News 1', author: 'Bob', description: 'Desc 2', urlToImage: 'img2.jpg', publishedAt: '2025-10-02' },
    { title: 'Tech News 2', author: 'Alice', description: 'Desc 3', urlToImage: 'img3.jpg', publishedAt: '2025-10-03' },
    { title: 'Health News 1', author: 'Carol', description: 'Desc 4', urlToImage: '', publishedAt: '2025-10-01' },
  ];

  beforeEach(async () => {
    const newsSpy = jasmine.createSpyObj('NewsService', ['getNews']);

    await TestBed.configureTestingModule({
      imports: [StatisticsComponent, HttpClientTestingModule],
      providers: [{ provide: NewsService, useValue: newsSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(StatisticsComponent);
    component = fixture.componentInstance;
    newsService = TestBed.inject(NewsService) as jasmine.SpyObj<NewsService>;
    ngZone = TestBed.inject(NgZone);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch news and initialize articles', fakeAsync(() => {
    // Mock all categories to return mockArticles
    newsService.getNews.and.returnValue(of(mockArticles));

    component.ngOnInit();
    tick(); // simulate async

    expect(component.articles.length).toBeGreaterThanOrEqual(mockArticles.length);
    expect(Object.keys(component.categoryArticles).length).toBeGreaterThan(0);
    expect(component.categoryChartData.datasets[0].data.length).toBeGreaterThan(0);
  }));

  it('should set selectedCategoryArticles when category is clicked', fakeAsync(() => {
    component.categoryChartData = { labels: ['General', 'Technology'], datasets: [{ data: [1, 2], label: 'Articles per Category' }] };
    component.categoryArticles = {
      'General': [mockArticles[0]],
      'Technology': [mockArticles[1], mockArticles[2]]
    };

    ngZone.run(() => {
      // simulate chart click on index 1 (Technology)
      (component.categoryChartOptions.onClick as any)(null, [{ index: 1 }]);
    });

    expect(component.selectedCategory).toBe('Technology');
    expect(component.selectedCategoryArticles.length).toBe(2);
    expect(component.selectedDateArticles.length).toBe(0);
    expect(component.selectedAuthorArticles.length).toBe(0);
  }));

  it('should set selectedDateArticles when line chart is clicked', fakeAsync(() => {
    component.latestChartData = { labels: ['10/1/2025', '10/2/2025'], datasets: [{ data: [1, 1], label: 'Articles Over Time' }] };
    component.dateArticles = {
      '10/1/2025': [mockArticles[0]],
      '10/2/2025': [mockArticles[1]]
    };

    ngZone.run(() => {
      (component.lineChartOptions.onClick as any)(null, [{ index: 0 }]);
    });

    expect(component.selectedDate).toBe('10/1/2025');
    expect(component.selectedDateArticles.length).toBe(1);
    expect(component.selectedCategoryArticles.length).toBe(0);
    expect(component.selectedAuthorArticles.length).toBe(0);
  }));

  it('should set selectedAuthorArticles when pie chart is clicked', fakeAsync(() => {
    component.activeAuthorsChartData = { labels: ['Alice', 'Bob'], datasets: [{ data: [2, 1], label: 'Active Authors' }] };
    component.authorArticles = { 'Alice': [mockArticles[0], mockArticles[2]], 'Bob': [mockArticles[1]] };

    ngZone.run(() => {
      (component.pieChartOptions.onClick as any)(null, [{ index: 0 }]);
    });

    expect(component.selectedAuthor).toBe('Alice');
    expect(component.selectedAuthorArticles.length).toBe(2);
    expect(component.selectedCategoryArticles.length).toBe(0);
    expect(component.selectedDateArticles.length).toBe(0);
  }));

  it('should reset all selections when closeList is called', () => {
    component.selectedCategory = 'General';
    component.selectedCategoryArticles = [mockArticles[0]];
    component.selectedDate = '10/1/2025';
    component.selectedDateArticles = [mockArticles[0]];
    component.selectedAuthor = 'Alice';
    component.selectedAuthorArticles = [mockArticles[0]];

    component.closeList();

    expect(component.selectedCategory).toBeNull();
    expect(component.selectedCategoryArticles.length).toBe(0);
    expect(component.selectedDate).toBeNull();
    expect(component.selectedDateArticles.length).toBe(0);
    expect(component.selectedAuthor).toBeNull();
    expect(component.selectedAuthorArticles.length).toBe(0);
  });
});
