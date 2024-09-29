import { AbstractControl, ValidationErrors } from '@angular/forms';
import { UserService } from '../../_services/user.service';

export class CustomValidators {
  constructor(public userService: UserService) { }

  static cannotContainSpace(control: AbstractControl) : ValidationErrors {
    if ((control.value as string).indexOf(' ') >= 0)
      return { cannotContainSpace: true }

    return null;
  }
  static cannotStartWithNumber(control: AbstractControl) : ValidationErrors {
    // var re = /^[a-zA-Z]{1}/;
    var re = /^[a-zA-Z]+[a-zA-Z0-9]+([_ -]?[a-zA-Z0-9])*$/;
    if (control.value as string && !re.test(control.value as string))
      return { cannotStartWithNumber: true }

    return null;
  }
  static cannotContainNumber(control: AbstractControl) : ValidationErrors {
    var re = /^[A-Za-z ]+$/;
    // var re = /^[a-zA-Z][a-zA-Z ]+[a-zA-Z]$/;
    if (control.value as string && !re.test(control.value as string))
      return { cannotContainNumber: true };

    return null;
  }
}
