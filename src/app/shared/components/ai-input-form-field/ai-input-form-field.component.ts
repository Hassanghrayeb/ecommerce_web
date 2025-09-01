import { Component, EventEmitter, Input, Output, Self } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import {InputColor, InputMode, InputShape} from '../../enums/input-mode.enum';

@Component({
  selector: 'laitron-input-form-field',
  templateUrl: './ai-input-form-field.component.html',
  styleUrls: ['./ai-input-form-field.component.sass']
})
export class AiInputFormFieldComponent implements ControlValueAccessor {
  @Input() placeholdertext: string;
  @Input() formControlName: string;
  @Input() placeholderIcon: string;
  @Input() withLabel: boolean = false;
  @Input() fieldLabel: string;
  @Input() prefix: string;
  @Input() isPassword: boolean = false;
  @Input() color: InputColor = InputColor.PRIMARY10;
  @Input() shape: InputShape = InputShape.PRIMARY;
  @Input() mode : InputMode = InputMode.DARK;
  @Input() maxLength: string | number | null = null;
  @Input() isDisabled: boolean = false;
  @Input() autocomplete: string = 'on';
  @Input() showValidationError: boolean = false;
  @Input() stepValue: number;
  @Input() trailingIcon: string;
  @Output() blur = new EventEmitter<FocusEvent>();
  hidePassword = true;

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

  public togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
}
