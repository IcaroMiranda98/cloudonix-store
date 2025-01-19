import { createCustomElement } from '@angular/elements';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent)
  .then((appRef) => {
    const injector = appRef.injector;

    // Cria o Custom Element a partir do componente Angular
    const ngChild = createCustomElement(AppComponent, { injector });

    // Define o elemento no DOM
    customElements.define('item-component', ngChild);
  })
  .catch((err) => console.error(err));
