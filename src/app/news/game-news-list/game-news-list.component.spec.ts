import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameNewsListComponent } from './game-news-list.component';

describe('GameNewsListComponent', () => {
  let component: GameNewsListComponent;
  let fixture: ComponentFixture<GameNewsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameNewsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameNewsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
