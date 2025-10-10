import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CurrentAffairsComponent } from './current-affairs.component';
import { NewsService, NewsArticle } from '../news.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CurrentAffairsComponent', () => {
  let component: CurrentAffairsComponent;
  let fixture: ComponentFixture<CurrentAffairsComponent>;
  let newsService: jasmine.SpyObj<NewsService>;

  const mockArticles: NewsArticle[] = [
    { title: 'Article 1', publishedAt: '2025-10-01', description: 'Desc 1', url: '#', category: 'General' },
    { title: 'Article 2', publishedAt: '2025-10-02', description: 'Desc 2', url: '#', category: 'Technology' },
  ];

  beforeEach(async () => {
    const newsSpy = jasmine.createSpyObj('NewsService', ['getNews']);

    await TestBed.configureTestingModule({
      imports: [CurrentAffairsComponent, HttpClientTestingModule],
      providers: [{ provide: NewsService, useValue: newsSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(CurrentAffairsComponent);
    component = fixture.componentInstance;
    newsService = TestBed.inject(NewsService) as jasmine.SpyObj<NewsService>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch news on init', () => {
    newsService.getNews.and.returnValue(of(mockArticles));
    component.ngOnInit();
    expect(component.affairs()).toEqual(mockArticles);
    expect(component.filteredAffairs()).toEqual(mockArticles);
  });

  it('should add a new affair', () => {
    component.newAffair = { title: 'New Affair', publishedAt: '', description: 'New Desc', url: '#', category: 'General' };
    component.affairs.set([]);
    component.filteredAffairs.set([]);

    component.addAffair();

    expect(component.affairs().length).toBe(1);
    expect(component.filteredAffairs().length).toBe(1);
    expect(component.newAffair.title).toBe('');
    expect(component.showForm()).toBe(false);
  });

  it('should not add affair if title is empty', () => {
    component.newAffair = { title: '', publishedAt: '', description: '', url: '', category: 'General' };
    component.affairs.set([]);
    component.filteredAffairs.set([]);

    component.addAffair();

    expect(component.affairs().length).toBe(0);
    expect(component.filteredAffairs().length).toBe(0);
  });

  it('should delete an affair', () => {
    component.affairs.set([...mockArticles]);
    component.filteredAffairs.set([...mockArticles]);

    component.deleteAffair(0);

    expect(component.affairs().length).toBe(1);
    expect(component.filteredAffairs().length).toBe(1);
    expect(component.affairs()[0].title).toBe('Article 2');
  });

  it('should filter affairs by category', () => {
    component.affairs.set([...mockArticles]);
    component.filteredAffairs.set([...mockArticles]);

    component.filterByCategory('Technology');

    expect(component.filteredAffairs().length).toBe(1);
    expect(component.filteredAffairs()[0].category).toBe('Technology');
  });

  it('should show all affairs when filtering with "All"', () => {
    component.affairs.set([...mockArticles]);
    component.filteredAffairs.set([]);

    component.filterByCategory('All');

    expect(component.filteredAffairs().length).toBe(mockArticles.length);
  });

  it('should show and hide the add form', () => {
    component.showAddForm();
    expect(component.showForm()).toBe(true);

    component.showAllAffairs();
    expect(component.showForm()).toBe(false);
  });

  it('should edit an affair', () => {
    component.affairs.set([...mockArticles]);
    component.filteredAffairs.set([...mockArticles]);

    component.editAffair(mockArticles[0], 0);

    expect(component.newAffair.title).toBe('Article 1');
    expect(component.affairs().length).toBe(1); // Article 1 removed
    expect(component.showForm()).toBe(true);
  });
});
