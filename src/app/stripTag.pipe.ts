import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'stripTag'
})
export class StripTagPipe implements PipeTransform {
    transform(str: string, tag: string) {
        if (!str.length) {
            return null;
        } 
        if (!tag.length) {
            return str;
        }
        var re = new RegExp(tag + '[^>]*>',"g");
        return str.replace(re,"");
    }
}