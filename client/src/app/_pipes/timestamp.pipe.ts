import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timestamp',
})
export class TimestampPipe implements PipeTransform {
  transform(value: string): string {
    var timeStamp = '';
    var date = new Date().toISOString();
    var newDateNow = date.split('T')[0];
    var newDateItem = new Date(value).toISOString().split('T')[0];
    var dateArray = newDateNow.split('-');
    var dateArrayItem = newDateItem.split('-');

    let years, months, days;
    years = +dateArray[0] - +dateArrayItem[0];
    months = +dateArray[1] - +dateArrayItem[1];
    days = +dateArray[2] - +dateArrayItem[2];

    if (years > 0) {
      if (years === 1) timeStamp = `${years} year ago`;
      else timeStamp = `${years} years ago`;
    } else if (months > 0) {
      if (months === 1) timeStamp = `${months} month ago`;
      else timeStamp = `${months} months ago`;
    } else {
      if (days === 0) {
        timeStamp = `Today`;
      } else if (days === 1) {
        timeStamp = `Yesterday`;
      } else {
        timeStamp = `${days} days ago`;
      }
    }
    return timeStamp;
  }
}
