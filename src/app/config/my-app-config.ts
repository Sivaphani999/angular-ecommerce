import { pkce } from "@okta/okta-auth-js";

export default{

    oidc:{
        clientId: '0oahg7n6mnVD1BSEx5d7',
        issuer: 'https://dev-86658196.okta.com/oauth2/default',
        redirectUri : 'https://localhost:4200/login/callback',
        scopes: ['openid','profile','email'],
    }

}
