import { createCustomElement } from '@angular/elements';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig)
  .then((appRef) => {
    const injector = appRef.injector;

    // Cria o Custom Element a partir do componente Angular
    const product = createCustomElement(AppComponent, { injector });

    // Define o elemento no DOM
    customElements.define('product-component', product);
  })
  .catch((err) => console.error(err));
