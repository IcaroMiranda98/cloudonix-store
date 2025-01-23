import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { Product } from '../types/types';
import { ProductService } from './product.service';

fdescribe('ItemService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  const mockProducts: Product[] = [
    {
      id: 1,
      name: 'Tyvek Interoffice Envelopes, 9 1/2" x 12 1/2", 100/Box',
      description: 'Tyvek Interoffice Envelopes, 9 1/2" x 12 1/2", 100/Box',
      sku: 'OFF-EN-10001453',
      cost: 182.9,
      profile: {
        teste: 'teste3',
        backlog: 1,
        //available: true,
        type: 'equipment',
      },
    },
    {
      id: 2,
      name: 'Dot Matrix Printer Tape Reel Labels, White, 5000/Box',
      description: 'Dot Matrix Printer Tape Reel Labels, White, 5000/Box',
      sku: 'OFF-LA-10003930',
      cost: 235.94,
      profile: {
        type: 'equipment',
      },
    },
    {
      id: 20,
      name: 'Sauder Inglewood Library Bookcases',
      description: 'Sauder Inglewood Library Bookcases',
      sku: 'FUR-BO-10000362',
      cost: 341.9,
      profile: {
        type: 'equipment',
      },
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#getProducts', () => {
    it('should retrieve all products and map them to Product instances', () => {
      service.getProducts().subscribe((products) => {
        expect(products.length).toBe(3);
        expect(products[0]).toEqual(jasmine.any(Product));
        expect(products[0].id).toBe(mockProducts[0].id);
        expect(products[1].name).toBe(mockProducts[1].name);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/items`);
      expect(req.request.method).toBe('GET');
      req.flush(mockProducts);
    });
  });

  describe('#deleteProduct', () => {
    it('should delete a product by ID and handle 204 No Content', () => {
      service.deleteProduct(1).subscribe((response) => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/items/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null, { status: 204, statusText: 'No Content' });
    });
  });
});
