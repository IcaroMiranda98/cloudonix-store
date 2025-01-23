import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../../src/environments/environment';
import { Product } from '../app/product';
import { ProductService } from './product.service';

describe('ItemService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  const mockProduct: Product = {
    id: 1,
    name: 'Tyvek Interoffice Envelopes, 9 1/2" x 12 1/2", 100/Box',
    description: 'Tyvek Interoffice Envelopes, 9 1/2" x 12 1/2", 100/Box',
    sku: 'OFF-EN-10001453',
    cost: 182.9,
    profile: {
      backlog: 1,
      //available: true,
      type: 'equipment',
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(ProductService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#getProduct', () => {
    it('should retrieve a product by ID', () => {
      service.getProduct(1).subscribe((product) => {
        expect(product).toEqual(mockProduct);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/items/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockProduct);
    });
  });

  describe('#createProduct', () => {
    it('should create a new product', () => {
      service.createProduct(mockProduct).subscribe((product) => {
        expect(product).toEqual(mockProduct);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/items`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockProduct);
      req.flush(mockProduct);
    });
  });

  describe('#updateProduct', () => {
    it('should update an existing product', () => {
      service.updateProduct(mockProduct).subscribe((product) => {
        expect(product).toEqual(mockProduct);
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/items/${mockProduct.id}`,
      );
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(mockProduct);
      req.flush(mockProduct);
    });

    it('should handle 400 error on update', () => {
      const errorMessage = 'SKU must not be updated';

      service.updateProduct(mockProduct).subscribe({
        next: () => fail('Expected an error, but got a response'),
        error: (error) => {
          expect(error.status).toBe(400);
          expect(error.error.message).toBe(errorMessage);
        },
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/items/${mockProduct.id}`,
      );
      req.flush(
        { message: errorMessage },
        { status: 400, statusText: 'Bad Request' },
      );
    });
  });
});
