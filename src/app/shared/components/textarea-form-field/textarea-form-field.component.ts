import { Component, Input, Self } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import {InputColor, InputMode, InputShape} from '../../enums/input-mode.enum';

@Component({
  selector: 'laitron-textarea-form-field',
  templateUrl: './textarea-form-field.component.html',
  styleUrl: './textarea-form-field.component.sass'
})
export class TextareaFormFieldComponent {

    @Input() placeholdertext: string;
    @Input() formControlName: string;
    @Input() placeholderIcon: string;
    @Input() withLabel: boolean = false;
    @Input() fieldLabel: string;
    @Input() color: InputColor = InputColor.PRIMARY10;
    @Input() shape: InputShape = InputShape.PRIMARY;
    @Input() mode : InputMode = InputMode.DARK;
    @Input() minRows: number = 2;
    @Input() maxRows: number = 6;

    constructor(@Self() public ngControl: NgControl) {
      this.ngControl.valueAccessor = this;
    }
  
    writeValue(obj: any): void {
    }
    registerOnChange(fn: any): void {
  
    }
    registerOnTouched(fn: any): void {
  
    }
  
    get formControl(): FormControl {
      return this.ngControl.control as FormControl || new FormControl();
    }
  
    fieldInvalid(): boolean {
      const field = this.ngControl?.control;
      return field ? field.touched && field.invalid : false;
    }
  
    fieldRequired(): boolean {
      const field = this.ngControl?.control;
      if (field?.validator) {
          const validator = field.validator({} as AbstractControl);
          if (validator && validator['required']) {
          return true;
          }
      }
      return false;
    }
}
