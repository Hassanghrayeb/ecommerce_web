import { Component, EventEmitter, Input, Output, Self } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { InputColor, InputShape } from '../../enums/input-mode.enum';
import { DropdownOption } from '../../models/dropdown-option.model';

@Component({
  selector: 'ecommerce-radio-button',
  templateUrl: './ai-radio-button.component.html',
  styleUrl: './ai-radio-button.component.sass'
})
export class AiRadioButtonComponent implements ControlValueAccessor {
  @Input() placeholdertext: string;
  @Input() formControlName: string;
  @Input() withLabel: boolean = false;
  // @Input() placeholderIcon: string;
  // @Input() withIcon: boolean = false;
  // @Input() withClearButton: boolean = false;
  @Input() options: DropdownOption[];
  @Input() color: InputColor = InputColor.PRIMARY10;
  @Input() shape: InputShape = InputShape.PRIMARY;

  @Output() selectionChange = new EventEmitter<any>();

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};
  value: any;

  constructor(@Self() public ngControl: NgControl) {
    this.ngControl.valueAccessor = this;
  }

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onSelectionChange(value: any): void {
    this.value = value;
    this.onChange(value);
    this.onTouched();
    this.selectionChange.emit(value);
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
