import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export class CustomValidators {
  static noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const isWhitespace = (control.value || '').trim().length === 0;
      const isValid = !isWhitespace;
      return isValid ? null : {whitespace: true};
    };
  }

  static strongPasswordValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
    const passwordPattern = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?=\S+$).{8,}$/;
    return password && !passwordPattern.test(password) ? {weakPassword: true} : null;
  }

  static arabicOnlyValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const arabicPattern = /^[\u0600-\u06FF\s]+$/;

    return value && !arabicPattern.test(value) ? { arabicOnly: true } : null;
  }

  static confirmPasswordValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.root.get('password');
    const confirmPassword = control;
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return {passwordsDoNotMatch: true};
    }
    return null;
  }

  static emailValidator(control: AbstractControl): ValidationErrors | null{
    const email = control.value;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net|edu|gov|mil|int|info|io|co|[a-z]{2,4})$/i;
    return email && !emailPattern.test(email) ? {invalidEmail: true} : null;
  }



  static expirationDateValidator(control: AbstractControl): ValidationErrors | null {
    const expDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expDateRegex.test(control.value)) {
      return { invalidExpirationFormat: true };
    }

    const [month, year] = control.value.split('/').map(Number);
    const expiry = new Date(2000 + year, month);
    const today = new Date();
    return expiry > today ? null : { expiredCard: true };
  }

  static maxValueValidator(max: number): ValidatorFn {
    return (control: AbstractControl) => {
      const value = Number(control.value);
      return isNaN(value) || value <= max ? null : { maxValueError: true, requiredMaxValue: max };
    };
  }
}
