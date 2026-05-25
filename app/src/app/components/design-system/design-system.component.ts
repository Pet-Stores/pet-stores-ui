import { Component } from '@angular/core';

@Component({
    selector: 'app-design-system',
    templateUrl: './design-system.component.html',
    styleUrls: ['./design-system.component.scss'],
    standalone: true
})
export class DesignSystemComponent {
  scrollTo(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
