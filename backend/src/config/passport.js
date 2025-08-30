import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import sendEmail from '../services/emailService.js';
import chalk from 'chalk';

// This function configures the Passport.js strategies for the application.
export default function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        const newUser = {
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
        };

        try {
          // --- ENTERPRISE-GRADE LOGIN/LINKING LOGIC ---

          // 1. Find user by Google ID (fastest and most reliable)
          let user = await User.findOne({ googleId: profile.id });
          if (user) {
            return done(null, user);
          }

          // 2. If no user with Google ID, check if an account with that email already exists
          user = await User.findOne({ email: newUser.email });
          if (user) {
            // Link the Google ID to the existing account
            user.googleId = profile.id;
            await user.save();
            console.log(chalk.blue(`Linked Google ID to existing user: ${user.email}`));
            return done(null, user);
          }

          // 3. If no user exists at all, create a new one
          user = await User.create({ ...newUser, role: 'admin', status: 'pending' });
          console.log(chalk.green(`New pending admin created via Google: ${user.name} (${user.email})`));

          // --- Notify Super Admin of New Sign-up ---
          try {
            const superAdmin = await User.findOne({ role: 'super-admin' });
            if (superAdmin) {
              await sendEmail({
                to: superAdmin.email,
                template: 'newAdminSignUp',
                context: { name: user.name, email: user.email },
              });
              console.log(chalk.blue(`Approval notification sent to Super Admin: ${superAdmin.email}`));
            } else {
               console.log(chalk.yellow('Super Admin not found. Could not send approval notification email.'));
            }
          } catch (emailError) {
            console.error(chalk.red('Failed to send admin approval notification email:'), emailError);
          }

          return done(null, user);

        } catch (err) {
          console.error(chalk.red.bold('Error during Google Strategy execution:'), err);
          return done(err, null);
        }
      }
    )
  );

  // Serializes user to the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserializes user from the session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
}
