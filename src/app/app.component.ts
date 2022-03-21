import { Component } from '@angular/core'

@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
  `,
  styles: [`
    :host {
      display: grid;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
    }
    router-outlet {
      display: none;
    }
  `]
})
export class AppComponent {
  title = 'Tiny Towns Trainer';
}
