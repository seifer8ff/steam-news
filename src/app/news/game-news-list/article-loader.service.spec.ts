import { TestBed, inject } from '@angular/core/testing';

import { ArticleLoaderService } from './article-loader.service';

describe('ArticleLoaderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ArticleLoaderService]
    });
  });

  it('should be created', inject([ArticleLoaderService], (service: ArticleLoaderService) => {
    expect(service).toBeTruthy();
  }));
});
