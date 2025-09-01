import { Component, Input } from '@angular/core';
import {InputColor} from "../../enums/input-mode.enum";

@Component({
  selector: 'laitron-empty-icon',
  templateUrl: './empty-icon.component.html',
  styleUrl: './empty-icon.component.sass'
})
export class EmptyIconComponent {
    @Input() mainText: string;
    @Input() subText: string;
    @Input() imagePath = 'assets/icons/gavel.svg';
}
