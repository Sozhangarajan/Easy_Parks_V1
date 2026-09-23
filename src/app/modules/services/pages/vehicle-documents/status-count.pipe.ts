import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'statusCount', standalone: true })
export class StatusCountPipe implements PipeTransform {
  transform(items: { status: string }[], status: string): number {
    return items.filter((i) => i.status === status).length;
  }
}
