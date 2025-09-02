import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'ecommerce-input-form-error',
  templateUrl: './input-form-error.component.html',
  styleUrl: './input-form-error.component.sass'
})
export class InputFormErrorComponent {

  @Input() control!: AbstractControl | null;
}
