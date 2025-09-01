import {Component, EventEmitter, Input, OnChanges, OnInit, Output, Self, SimpleChanges, ViewChild} from '@angular/core';
import {DropdownOption} from '../../models/dropdown-option.model';
import {InputColor, InputShape, SizeEnum} from '../../enums/input-mode.enum';
import {AbstractControl, FormControl, NgControl} from '@angular/forms';
import {MatSelect, MatSelectChange} from '@angular/material/select';

@Component({
  selector: 'laitron-dropdown',
  templateUrl: './ai-dropdown.component.html',
  styleUrl: './ai-dropdown.component.sass'
})
export class AiDropdownComponent implements OnInit{
  @Input() placeholdertext: string;
  @Input() formControlName: string;
  @Input() placeholderIcon: string;
  @Input() fieldLabel: string;
  @Input() withLabel: boolean = false;
  @Input() withIcon: boolean = false;
  @Input() withClearButton: boolean = false;
  @Input() dropdownOptions: DropdownOption[];
  @Input() color: InputColor = InputColor.PRIMARY10;
  @Input() shape: InputShape = InputShape.PRIMARY;
  @Input() isMultiple: boolean = false;
  @Input() textSize: SizeEnum = SizeEnum.BIG;
  @Input() title: string;
  @Input() customPanelClass: string = '';
  @Input() showValidationError: boolean = false;
  @Output() selectionChange = new EventEmitter<MatSelectChange>();
  @ViewChild('select') private select: MatSelect;

  private _initialSelectedIds: number[] = [];

  constructor(@Self() public ngControl: NgControl) {
    this.ngControl.valueAccessor = this;
  }

  ngOnInit(): void {
    if (this.isMultiple) {
      this.formControl.valueChanges.subscribe(val => this.selectionChange.emit(val));
    }
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

  public optionSelected(): void{
    this.selectionChange.emit(new MatSelectChange(this.select, this.getSelectedValue()));
  }

  public clear(): void{
    this.ngControl.control?.setValue(null);
  }

  public getSelectedValue() {
    return this.ngControl.control?.value;
  }

  public getSelectedValueIcon() {
    const selectedValues = this.getSelectedValue();
    if (!Array.isArray(selectedValues)) {
      console.error('getSelectedValue() did not return an array');
      return null;
    }
    return this.dropdownOptions.filter(option => {
      const val = option.value ?? option;
      return selectedValues.includes(val);
    });
  }

  public isAllSelected(): boolean {
    const current: any[] = this.formControl.value || [];
    const allValues = this.dropdownOptions;
    return allValues?.length > 0 && allValues.every(v => current.includes(v.value ?? v));
  }

  public toggleAllFromClick(event: Event): void {
    event.stopPropagation();
    this.toggleAll();
  }

  public toggleAll(): void {
    if (this.isAllSelected()) {
      this.formControl.setValue([]);
    } else {
      const allValues = this.dropdownOptions.map(d => d.value ?? d);
      this.formControl.setValue([...allValues]);
    }
    this.select.close();
  }

  public isSelected(value: any): boolean {
    const current: any[] = this.formControl.value || [];
    const compareVal = value.value ?? value;
    return current.includes(compareVal);
  }

}
