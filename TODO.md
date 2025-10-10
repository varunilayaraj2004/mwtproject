# TODO: Add Google Sign-in and Register Options

## Steps to Complete:

1. **Update User Model**: Add `googleId` field to `server/models/User.js` schema (String, unique, optional). [x]

2. **Install Server Dependencies**: Run `cd server && npm install passport passport-google-oauth20` to add OAuth support. [x]

3. **Install Client Dependencies**: Run `cd client && npm install @react-oauth/google` for Google sign-in button. [x]

4. **Update Auth Controller**: Modify `server/controllers/auth/auth-controller.js` to include Passport Google strategy, `googleAuth` (initiate), and `googleAuthCallback` (handle response, user creation/login, JWT issuance). [x] (Handled in server.js)

5. **Update Auth Routes**: Add routes to `server/routes/auth/auth-routes.js`: GET `/google` and GET `/google/callback`. [x]

6. **Update Auth Slice**: Add `googleLogin` thunk to `client/src/store/auth-slice/index.js` to handle Google flow API calls. [ ] (Not needed for redirect flow)

7. **Update Login Page**: Edit `client/src/pages/auth/login.jsx` to wrap in GoogleOAuthProvider, add GoogleLogin button below form, handle success (redirect or API call). [x]

8. **Update Register Page**: Edit `client/src/pages/auth/register.jsx` similarly, since Google flow handles both login/register. [x]

9. **Environment Setup**: Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to server environment variables (e.g., .env file). User to provide credentials from Google Console. [ ]

10. **Testing**: 
    - Restart server.
    - Test Google sign-in on login/register pages.
    - Verify new user creation, existing user login, JWT cookie, role assignment.
    - Ensure works for user and admin (admins may need manual role update). [ ]

Progress: Core implementation complete. Set up environment variables and test.
