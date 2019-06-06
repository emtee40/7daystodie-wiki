import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ObjectService, SevenDaysObject} from '../object/object.service';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {DEFAULT_LANG, ENGLISH_LANG, LocalizationService} from '../localization/localization.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  query = new FormControl('');
  objects: SevenDaysObject[];
  filteredObjects: Observable<SevenDaysObject[]>;

  constructor(private objectService: ObjectService, private localization: LocalizationService, private router: Router) {
    this.objects = this.objectService.getAll();
    this.filteredObjects = this.query.valueChanges
      .pipe(
        startWith(''),
        map(object => object ? this._filterObjects(object) : this.objects.slice())
      );
  }

  ngOnInit() {
  }

  private _filterObjects(value: string): SevenDaysObject[] {
    const filterValue = value.toLowerCase();

    const matches = (stringValue: string) => stringValue.toLowerCase().indexOf(filterValue) !== -1;
    return this.objects.filter(object => {
      // check internal name
      return DEFAULT_LANG !== ENGLISH_LANG && matches(this.localization.translate(object.name)) ||
        matches(this.localization.translate(object.name, ENGLISH_LANG)) ||
        matches(object.name) ||
        DEFAULT_LANG !== ENGLISH_LANG && matches(this.localization.describe(object.name)) ||
        matches(this.localization.describe(object.name, ENGLISH_LANG));
    });
  }

  selectObject(object: SevenDaysObject): Promise<boolean> {
    return this.router.navigate([`/${object.name}`]);
  }
}
