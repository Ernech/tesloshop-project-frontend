import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'app-register-page',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register-page.component.html',
})
export class RegisterPageComponent {


  fb = inject(FormBuilder)
  authService = inject(AuthService)
  hasError = signal(false);
  isPosting = signal(false);
  router = inject(Router);

  registerForm = this.fb.group({
    fullName:['',[Validators.required,Validators.minLength(5)]],
    email: ['',[Validators.required, Validators.email]],
    password: ['',[Validators.required, Validators.minLength(6)]],
    repeatedPassword: ['',[Validators.required, Validators.minLength(6)]]
  },{
    validators:[
      this.isFieldOneEqualFieldTwo('password','repeatedPassword')
    ]})

private isFieldOneEqualFieldTwo(field1: string, field2: string) {
  return (formGroup: AbstractControl) => {
    const field1Control = formGroup.get(field1);
    const field2Control = formGroup.get(field2);

    if (!field1Control || !field2Control) return null;

    // Contraseñas distintas → marcar error
    if (field1Control.value !== field2Control.value) {
      field2Control.setErrors({ passwordsNotEqual: true });
      return { passwordsNotEqual: true };
    }

    // Contraseñas iguales → limpiar error
    if (field2Control.hasError('passwordsNotEqual')) {
      field2Control.setErrors(null);
    }

    return null;
  };
}
   onSubmit(){
    this.registerForm.markAllAsTouched();
    console.log(this.registerForm.get('fullName')?.errors);
    console.log(this.registerForm.get('email')?.errors);
    console.log('Form errors:', this.registerForm.errors);
console.log('Password control errors:', this.registerForm.get('password')?.errors);
console.log('RepeatedPassword control errors:', this.registerForm.get('repeatedPassword')?.errors);
    if(this.registerForm.invalid){
      this.hasError.set(true);
      setTimeout(()=>{
        this.hasError.set(false)
      },2000)
      return;
    }

    const { fullName='', email ='', password=''} = this.registerForm.value;
    this.authService.register(fullName!,email!,password!).subscribe(isRegistered=>{
        if(isRegistered){
          this.router.navigateByUrl('/')
          return;
        }
        this.hasError.set(true);
      setTimeout(()=>{
        this.hasError.set(false)
      },2000)
      return;
    })
  }
 }
