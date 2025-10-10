import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { ArticlesComponent } from './articles.component';
import { NewsService, NewsArticle } from '../news.service';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('ArticlesComponent', () => {
  let component: ArticlesComponent;
  let fixture: ComponentFixture<ArticlesComponent>;
  let newsServiceSpy: jasmine.SpyObj<NewsService>;

  const mockArticle: NewsArticle = {
    title: 'Test Title',
    description: 'Test Description',
    publishedAt: '2025-10-08T00:00:00Z',
    url: 'http://example.com',
    category: 'General'
  };

  beforeEach(waitForAsync(() => {
    const spy = jasmine.createSpyObj('NewsService', ['getNews']);

    TestBed.configureTestingModule({
      imports: [ArticlesComponent, FormsModule],
      providers: [
        { provide: NewsService, useValue: spy }
      ]
    }).compileComponents();

    newsServiceSpy = TestBed.inject(NewsService) as jasmine.SpyObj<NewsService>;
    newsServiceSpy.getNews.and.returnValue(of([mockArticle]));
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch all news on init', fakeAsync(() => {
    component.ngOnInit();
    tick(); // wait for promises
    expect(component.articles()).toContain(mockArticle);
    expect(component.filteredArticles()).toContain(mockArticle);
  }));

  it('should search articles correctly', () => {
    component.articles.set([mockArticle]);
    component.searchQuery.set('test');
    component.searchArticles();
    expect(component.filteredArticles()).toContain(mockArticle);

    component.searchQuery.set('nonexistent');
    component.searchArticles();
    expect(component.filteredArticles().length).toBe(0);
  });

  it('should show and hide form', () => {
    component.showForm();
    expect(component.showAddForm()).toBeTrue();

    component.hideForm();
    expect(component.showAddForm()).toBeFalse();
  });

  it('should add a new article', () => {
    component.newArticle = { ...mockArticle };
    component.addArticle();

    expect(component.myArticles()[0].title).toBe(mockArticle.title);
    expect(component.filteredArticles()[0].title).toBe(mockArticle.title);
    expect(component.newArticle.title).toBe('');
    expect(component.showAddForm()).toBeFalse();
  });

  it('should not add article if title or description is empty', () => {
    component.newArticle = { ...mockArticle, title: '' };
    component.addArticle();
    expect(component.myArticles().length).toBe(0);
  });

  it('should delete my article', () => {
    component.myArticles.set([mockArticle]);
    component.filteredArticles.set([mockArticle]);

    component.deleteMyArticle(0);
    expect(component.myArticles().length).toBe(0);
    expect(component.filteredArticles().length).toBe(0);
  });
});
