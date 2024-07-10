import { Component, Inject } from '@angular/core';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import OktaAuth from '@okta/okta-auth-js';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrl: './login-status.component.css'
})
export class LoginStatusComponent {
  isAuthenticated: boolean = false;
  userFullName: string = '';
  email: string = '';
  
  storage: Storage = sessionStorage;
  constructor(private oktaAuthService:OktaAuthStateService,
    @Inject(OKTA_AUTH) private oktaAuth:OktaAuth) {
    
    }

    ngOnInit() {

      this.oktaAuthService.authState$.subscribe(
        (result) => {
          console.log(result);
          this.isAuthenticated = result.isAuthenticated!;
          this.getUserDetails();
        }
      )
    }

    getUserDetails() {
      if(this.isAuthenticated){
        this.oktaAuth.getUser().then(
          (res) => {
            this.userFullName = res.name as string;

            this.email = res.email as string;
            
            this.storage.setItem('userEmail', JSON.stringify(this.email));
          }
        )
      }
    }

    logout() {
      this.oktaAuth.signOut();
    }
}
