import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GlossaryComponent, GlossaryTerm } from './glossary.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

describe('GlossaryComponent', () => {
  let component: GlossaryComponent;
  let fixture: ComponentFixture<GlossaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlossaryComponent, CommonModule, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(GlossaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize terms and filteredTerms on ngOnInit', () => {
    component.ngOnInit();
    expect(component.terms().length).toBe(10); // 10 sample terms
    expect(component.filteredTerms().length).toBe(10);
  });

  it('should filter terms correctly for a matching search query', () => {
    component.ngOnInit();
    component.searchQuery.set('editorial');
    component.searchTerms();

    const filtered = component.filteredTerms();
    expect(filtered.length).toBe(1);
    expect(filtered[0].term).toBe('Editorial');
  });

  it('should filter terms correctly for a query matching definition', () => {
    component.ngOnInit();
    component.searchQuery.set('syndicated');
    component.searchTerms();

    const filtered = component.filteredTerms();
    expect(filtered.length).toBe(1);
    expect(filtered[0].term).toBe('Newswire');
  });

  it('should return all terms if search query is empty', () => {
    component.ngOnInit();
    component.searchQuery.set('');
    component.searchTerms();

    expect(component.filteredTerms().length).toBe(10);
  });

  it('should be case-insensitive when searching', () => {
    component.ngOnInit();
    component.searchQuery.set('bReaKing');
    component.searchTerms();

    const filtered = component.filteredTerms();
    expect(filtered.length).toBe(1);
    expect(filtered[0].term).toBe('Breaking News');
  });

  it('should return empty array if no match is found', () => {
    component.ngOnInit();
    component.searchQuery.set('NonExistingTerm');
    component.searchTerms();

    expect(component.filteredTerms().length).toBe(0);
  });
});
