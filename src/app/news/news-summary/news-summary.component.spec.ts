import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsSummaryComponent } from './news-summary.component';

describe('NewsSummaryComponent', () => {
  let component: NewsSummaryComponent;
  let fixture: ComponentFixture<NewsSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
