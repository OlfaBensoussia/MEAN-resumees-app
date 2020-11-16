import { TestBed } from '@angular/core/testing';

import { LevelGuard } from './level.guard';

describe('LevelGuard', () => {
  let guard: LevelGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(LevelGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
