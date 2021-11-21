import { Component, ElementRef, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  title = 'angular-coverage-parser'
  themeForm: FormGroup

  constructor(private elementRef: ElementRef) { 
    this.themeForm = new FormGroup({
      color: new FormControl('', [
      ]),
    })
  }

  /*async changeColor(target: any) {
    this.elementRef.nativeElement.style.setProperty('--primary', target.value);
    console.log("wse")
  }*/

}
