import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';

@Injectable()
export class PickDateAdapter extends NativeDateAdapter {

  public format(date: Date, displayFormat: any): string {
    const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    utcDate.setUTCHours(utcDate.getUTCHours() + 2);
    if (displayFormat === 'input') {
      const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
      const formattedDate = formatDate(utcDate, 'dd/MM/yyyy', 'en', 'lb');
      let newValue = "";

      for (var i = 0; i < formattedDate.length; i++) {
        const index = parseInt(formattedDate.charAt(i), 10);
        const newdigit = numbers[index] || formattedDate.charAt(i);

        newValue = newValue.concat(newdigit);
      }
      return newValue;
    } else {
      return utcDate.toDateString();
    }
  }

  override createDate(year: number, month: number, date: number): Date {
    // Create the date in UTC
    const utcDate = new Date(Date.UTC(year, month, date));

    // Return it as a local date in the user's current time zone
    return new Date(utcDate);
  }



}
