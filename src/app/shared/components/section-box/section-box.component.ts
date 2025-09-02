import {Component, Input} from '@angular/core';
import {InputColor, InputMode, InputShape} from "../../enums/input-mode.enum";
import {ButtonModel} from "../../models/button.model";

@Component({
  selector: 'ecommerce-section-box',
  templateUrl: './section-box.component.html',
  styleUrl: './section-box.component.sass'
})
export class SectionBoxComponent {
  @Input() title: string;
  @Input() description: string;
  @Input() descriptionWithHtml: string;
  @Input() button: ButtonModel[];
  @Input() withBorder: boolean = true;

  public inputColor = InputColor;
  public inputShape = InputShape;
  public inputMode = InputMode;
  
}
