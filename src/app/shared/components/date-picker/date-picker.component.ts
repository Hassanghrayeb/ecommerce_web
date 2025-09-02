import {Component, Input, OnDestroy, ViewChild, forwardRef, Self, booleanAttribute} from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl} from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { Subscription } from 'rxjs';
import {PickDateAdapter} from './date-picker.adapter';
import {InputColor, InputShape, SizeEnum} from "../../enums/input-mode.enum";

export const PICK_FORMATS = {
  parse: { dateInput: { month: 'long', year: 'numeric', day: 'short' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'long' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'short' },
    monthYearA11yLabel: { year: 'long', month: 'long' }
  }
};

@Component({
  selector: 'ecommerce-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.sass'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS }
  ]
})
export class DatepickerComponent {

  constructor(private dateAdapter: DateAdapter<Date>, @Self() public ngControl: NgControl) {
    this.dateAdapter.setLocale('en-LB');
    this.ngControl.valueAccessor = this;
  }
  @ViewChild('picker') picker: MatDatepicker<any>;
  @Input() startView: 'month' | 'year' | 'multi-year' = 'month';
  @Input() minDate: Date | null;
  @Input() maxDate: Date | null;
  @Input() formControlName: string;
  @Input() color: InputColor = InputColor.PRIMARY10;
  @Input() shape: InputShape = InputShape.PRIMARY;
  @Input() textSize: SizeEnum = SizeEnum.BIG;
  @Input() withLabel: boolean = false;
  @Input() placeholdertext: string;

  public value: Date | null = null;

  private onChange: (value: Date | null) => void = () => {};
  private onTouched: () => void = () => {};

  public openPicker(): void {
    this.picker.open();
  }

  public closePicker(): void {
    this.picker.close();
  }

  public togglePicker(): void {
    if (this.picker.opened) {
      this.closePicker();
    } else {
      this.openPicker();
    }
  }

  public clearDate(event: any) {
    event.stopPropagation();
    this.value = null;
    this.onChange(this.value);
  }

  // ControlValueAccessor implementation
  writeValue(date: Date | null): void {
    this.value = date;
  }

  registerOnChange(fn: (value: Date | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {

  }
  // Method to handle value change
  public dateChanged(date: Date | null): void {
    this.value = date;
    this.onChange(date);
    this.onTouched();
  }
}
