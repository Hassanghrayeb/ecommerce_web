import {Component} from '@angular/core';
import {InputColor, InputMode, InputShape} from "../shared/enums/input-mode.enum";

@Component({
  selector: 'laitron-landing',
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.sass'
})
export class LandingComponent {
  public inputShape = InputShape;
  public inputColor = InputColor;
  public inputMode = InputMode;

  constructor() {}
}
