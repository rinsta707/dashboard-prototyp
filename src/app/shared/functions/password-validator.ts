import {AbstractControl, FormGroup} from "@angular/forms";

export function mustMatch(controlName: string, matchingControlName: string) {
    return (group: AbstractControl) => {
      const control = group.get(controlName);
      const matchingControl = group.get(matchingControlName);

      if (!control || !matchingControl) {
        return null;
      }

      // return if another validator has already found an error on the matchingControl
      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return null;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
      return null;
    }

}

export function rolesValidator(control: AbstractControl): { [key: string]: boolean } | null {
  let formGroup = control as FormGroup;
  let isSystemAdmin = formGroup.controls['isSystemAdmin'].value;
  let isAdmin = formGroup.controls['isAdmin'].value;
  let isUser = formGroup.controls['isUser'].value;
  let isGuest = formGroup.controls['isGuest'].value;

  return isSystemAdmin || isAdmin || isUser || isGuest ? null : { missingRole: true };
}
