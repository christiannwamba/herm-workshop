---
title: "5.2 Protect GraphQL Endpoint with JWT"
metaTitle: "Protect GraphQL Endpoint with JWT"
---

## Objectives
- Understand why Claims/Roles are important
- Inject Claims using Auth0 Rules


## Exercise 1: JWT without Claims

In the previous section, we disabled the admin secret and set up JWT. The JWT decoding looks great, but we are still not able to run queries. If we try to run a query, we will get the following error:


![](https://paper-attachments.dropbox.com/s_3D31F9C005454339AD16C0C9C6648990BC1DD0FDEF1F993931CCFA78F282C0C1_1584630232567_image.png)


It says:

```json
{
  "errors": [
    {
      "extensions": {
        "path": "$",
        "code": "jwt-invalid-claims"
      },
      "message": "claims key: 'https://hasura.io/jwt/claims' not found"
    }
  ]
}
```

If we remember, we got the same error when we tried to decode the JSON:

![](https://paper-attachments.dropbox.com/s_8CEA89DA62ACACF12C3C20ED742B1CF6E45A2E791B15ACC8F9903C233F68C62C_1584629479437_image.png)


A claim is an object of what a user can and cannot do. Claims are used to hold user roles.

Hasura needs at least one role, eg `user`, to grant token permission. That is why we can’t still access data. This role should be on the `https://hasura.io/jwt/claims` of the JWT payload.

```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "https://hasura.io/jwt/claims": {
    "x-hasura-allowed-roles": ["editor","user", "mod"],
    "x-hasura-default-role": "user",
    "x-hasura-user-id": "1234567890",
    "x-hasura-org-id": "123",
    "x-hasura-custom": "custom-value"
  }
}
```

`x-hasura-allowed-roles` are possible roles the user can have while `x-hasura-default-role` is the default role of a user.

To custom claims like `https://hasura.io/jwt/claims`, we need to intercept the auth flow from Auth0 and provide the roles.


## Exercise 2: Set Claims with Auth0 Rules

<iframe src="https://player.vimeo.com/video/401259311" width="640" height="400" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>

From your dashboard, click Rules:


![](https://paper-attachments.dropbox.com/s_3D31F9C005454339AD16C0C9C6648990BC1DD0FDEF1F993931CCFA78F282C0C1_1584633019033_image.png)


Click the create rule button:


![](https://paper-attachments.dropbox.com/s_3D31F9C005454339AD16C0C9C6648990BC1DD0FDEF1F993931CCFA78F282C0C1_1584633083301_image.png)


Pick the Empty rule template:


![](https://paper-attachments.dropbox.com/s_3D31F9C005454339AD16C0C9C6648990BC1DD0FDEF1F993931CCFA78F282C0C1_1584633118995_image.png)


Paste the following function in the code editor to add update the JWT payload:

```js
function(user, context, callback) {
  const namespace = 'https://hasura.io/jwt/claims';
  context.accessToken[namespace] = {};
  context.accessToken\[namespace\]['x-hasura-default-role'] = 'user';
  context.accessToken\[namespace\]['X-Hasura-User-Id'] = user.screen_name;
  context.accessToken[namespace]['x-hasura-allowed-roles'] = [ 'user' ];
  callback(null, user, context);
}
```
 
All these while, Auth0 has NOT been giving us the user’s twitter handle. One benefit of the rule is that you can add more information about the user to the JWT payload. I have taken advantage of this to set the user id as the twitter handle which is available on the `user.screen_name` property.

Give the claim a name and click **SAVE CHANGES**


![](https://paper-attachments.dropbox.com/s_3D31F9C005454339AD16C0C9C6648990BC1DD0FDEF1F993931CCFA78F282C0C1_1585297412322_image.png)


Logout of the app and log in again, then get the JWT from http://localhost:3000/api/jwt.

Past the JWT in the Authorization field and decode. You should see that the Hasura claim now appears:


![](https://paper-attachments.dropbox.com/s_3D31F9C005454339AD16C0C9C6648990BC1DD0FDEF1F993931CCFA78F282C0C1_1584633764534_image.png)



## Exercise 3: Grant Users Access with Permissions

<iframe src="https://player.vimeo.com/video/399797720" width="640" height="400" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>

Having a role on the token payload means nothing unless you, as the developer, says it should mean something. Hasura permission feature allows you to have granular control over what a user can and cannot do. We will dig deeper into permissions later but for now, let’s add simple permission to show all accounts if you are a user:

Head to the **Data** page and click the **account** table. Click Permissions and add a `user` role. Next, under the `select` column of the new role you just typed in, click the edit icon that appears in the cell to edit


![](https://paper-attachments.dropbox.com/s_3D31F9C005454339AD16C0C9C6648990BC1DD0FDEF1F993931CCFA78F282C0C1_1584943299916_image.png)


Select **Without any check** under **Row select permissions**. Click **Toggle All** under **column select permissions**. Click **Save Permissions** to add the permission.

![](https://paper-attachments.dropbox.com/s_3D31F9C005454339AD16C0C9C6648990BC1DD0FDEF1F993931CCFA78F282C0C1_1584943972734_image.png)


Try to query once more:

```gql
query MyQuery {
  account {
    account_name
  }
}
```

You will get a valid response:


![](https://paper-attachments.dropbox.com/s_3D31F9C005454339AD16C0C9C6648990BC1DD0FDEF1F993931CCFA78F282C0C1_1584633826759_image.png)


