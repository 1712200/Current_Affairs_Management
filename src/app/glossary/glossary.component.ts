import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface GlossaryTerm {
  term: string;
  definition: string;
}

@Component({
  selector: 'app-glossary',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './glossary.component.html',
  styleUrls: ['./glossary.component.css']
})
export class GlossaryComponent implements OnInit {
  terms = signal<GlossaryTerm[]>([]);
  filteredTerms = signal<GlossaryTerm[]>([]);
  searchQuery = signal('');

  ngOnInit() {
    // Sample glossary data
    const sampleTerms: GlossaryTerm[] = [
      { term: 'Breaking News', definition: 'Urgent or important news reported immediately.' },
      { term: 'Editorial', definition: 'An article expressing the opinion of the editor or publisher.' },
      { term: 'Headline', definition: 'The title of a news article or story.' },
      { term: 'Press Release', definition: 'Official statement issued to newspapers giving information on a particular matter.' },
      { term: 'Byline', definition: 'The name of the author of a news story.' },
      { term: 'Source', definition: 'The origin of information in a news story.' },
      { term: 'Investigative Journalism', definition: 'In-depth reporting to uncover hidden facts or corruption.' },
      { term: 'Feature Article', definition: 'An article that goes beyond news to explain, entertain, or educate.' },
      { term: 'Column', definition: 'A regular article written by the same person on a specific topic.' },
      { term: 'Newswire', definition: 'Service that provides syndicated news to multiple media outlets.' }
    ];
    this.terms.set(sampleTerms);
    this.filteredTerms.set(sampleTerms);
  }

  searchTerms() {
    const query = this.searchQuery().toLowerCase();
    if (!query) {
      this.filteredTerms.set(this.terms());
    } else {
      this.filteredTerms.set(
        this.terms().filter(t =>
          t.term.toLowerCase().includes(query) ||
          t.definition.toLowerCase().includes(query)
        )
      );
    }
  }
}
