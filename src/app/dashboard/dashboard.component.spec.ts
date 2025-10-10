import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { NewsService, NewsArticle } from '../news.service';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let newsServiceMock: jasmine.SpyObj<NewsService>;

  const mockArticles: NewsArticle[] = [
    { title: 'Tech News', description: 'Some tech news', publishedAt: '2025-10-01', url: '', category: 'Technology' },
    { title: 'Business News', description: 'Some business news', publishedAt: '2025-10-02', url: '', category: 'Business' }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('NewsService', ['getNews']);

    await TestBed.configureTestingModule({
      imports: [DashboardComponent, CommonModule],
      providers: [{ provide: NewsService, useValue: spy }]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    newsServiceMock = TestBed.inject(NewsService) as jasmine.SpyObj<NewsService>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch news on ngOnInit with default category', () => {
    newsServiceMock.getNews.and.returnValue(of(mockArticles));

    component.ngOnInit();

    expect(newsServiceMock.getNews).toHaveBeenCalledWith('general');
    expect(component.articles).toEqual(mockArticles);
    expect(component.activeCategory).toBe('general');
  });

  it('should update articles and activeCategory when fetchNews is called', () => {
    newsServiceMock.getNews.and.returnValue(of(mockArticles));

    component.fetchNews('technology');

    expect(newsServiceMock.getNews).toHaveBeenCalledWith('technology');
    expect(component.articles).toEqual(mockArticles);
    expect(component.activeCategory).toBe('technology');
  });

  it('should handle errors gracefully when fetching news fails', () => {
    spyOn(console, 'error');
    newsServiceMock.getNews.and.returnValue(throwError(() => new Error('Network error')));

    component.fetchNews('business');

    expect(newsServiceMock.getNews).toHaveBeenCalledWith('business');
    expect(console.error).toHaveBeenCalledWith('Error fetching news:', jasmine.any(Error));
    expect(component.articles).toEqual([]); // articles remain empty on error
  });
});
