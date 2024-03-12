import { Directive, ElementRef, Input, OnInit, Optional, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[customClass]'
})
export class CustomAttributeDirective implements OnInit {
  @Input() customClass:string='';
  constructor(private elementRef: ElementRef, private viewContainerRef: ViewContainerRef, @Optional() private templateRef: TemplateRef<any>) { }

  ngOnInit() {
    this.elementRef.nativeElement.classList.add(this.customClass);
    console.log(this.viewContainerRef);
    console.log(this.templateRef);
  }
}
