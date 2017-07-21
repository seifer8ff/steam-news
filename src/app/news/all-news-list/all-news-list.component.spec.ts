import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllNewsListComponent } from './all-news-list.component';

describe('NewsListComponent', () => {
  let component: AllNewsListComponent;
  let fixture: ComponentFixture<AllNewsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllNewsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllNewsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
