import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-switch-demo',
  templateUrl: './switch-demo.component.html',
  styleUrls: ['./switch-demo.component.css'],
})
export class SwitchDemoComponent implements OnInit {
  form: any;
  choice: any;
  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
      this.createFormFields();
  }
  createFormFields() {
    this.form = this.formBuilder.group({
      choice: '',
    });
  }

  showChoice(){
    this.choice = this.form.value.choice;
  }
}
