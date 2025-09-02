import {Component, EventEmitter, Input, Output} from '@angular/core';
import {InputColor, InputMode, InputShape, SizeEnum} from '../../enums/input-mode.enum';

@Component({
  selector: 'ecommerce-button',
  templateUrl: './button.component.html',
  styleUrl: './button.component.sass'
})
export class ButtonComponent {

  @Input() buttonText: string;
  @Input() buttonType: string = "button";
  @Input() buttonIcon: string;
  @Input() disabled: boolean = false;
  @Input() color: InputColor = InputColor.SECONDARY22;
  @Input() shape: InputShape = InputShape.SECONDARY;
  @Input() mode: InputMode = InputMode.LIGHT;
  @Input() iconDirection: 'left' | 'right' = 'left';
  @Input() buttonSize: SizeEnum = SizeEnum.MEDIUM;
  @Input() tooltip?: string;

  @Output() buttonClick: EventEmitter<void> = new EventEmitter<void>();

  public onButtonClick(): void {
    this.buttonClick.emit();
  }

}
