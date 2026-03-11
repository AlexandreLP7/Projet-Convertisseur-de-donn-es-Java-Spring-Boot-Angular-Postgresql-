import { TestBed } from '@angular/core/testing';

import { Currency } from './core/services/currency.service';

describe('Currency', () => {
  let service: Currency;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Currency);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
