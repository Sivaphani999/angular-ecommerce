import { FormControl, ValidationErrors } from "@angular/forms";

export class Luv2ShopValidators {

    static notOnlyWhitespace(control: FormControl): ValidationErrors | null{
        if((control.value !== null) && (control.value.trim().length === 0)){
            return {'notOnlyWhitespaces':true}
        }
        else{
            return null;
        }
    }
}

