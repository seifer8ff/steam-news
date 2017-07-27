import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
    name: 'firstElement'
})
export class FirstElementPipe implements PipeTransform {
    constructor() {}

    transform(value: any) {
        return value ? value[0] : value;
    }
}