import {InputColor, InputMode, InputShape} from '../enums/input-mode.enum';

export interface ButtonModel {
  label: string;
  icon: string;
  iconDirection: 'left' | 'right';
  shape: InputShape;
  color: InputColor;
  mode: InputMode;
  triggerOnEnter?: boolean;
  action?: (id: number) => void;
}
