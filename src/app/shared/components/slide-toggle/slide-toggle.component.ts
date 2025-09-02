import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {InputColor, InputShape} from '../../enums/input-mode.enum';

@Component({
  selector: 'ecommerce-slide-toggle',
  templateUrl: './slide-toggle.component.html',
  styleUrls: ['./slide-toggle.component.sass']
})
export class SlideToggleComponent implements OnInit {

  @Input() color: InputColor = InputColor.PRIMARY10;
  @Input() shape: InputShape = InputShape.PRIMARY;
  @Input() choices: string[];
  @Output() onChoiceChange = new EventEmitter<string>();

  selectedChoice: string;

  ngOnInit(): void {
    this.selectedChoice = this.choices && this.choices.length > 0 ? this.choices[0] : '';
    this.emitValues();
  }

  public toggleChoice(): void {
    if (this.choices && this.choices.length === 2) {
      this.selectedChoice = this.selectedChoice === this.choices[0] ? this.choices[1] : this.choices[0];
      this.emitValues();
    }
  }

  private emitValues(): void {
    this.onChoiceChange.emit(this.selectedChoice);
  }
}
