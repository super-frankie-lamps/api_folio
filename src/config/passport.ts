import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import User from '../models/user';
import { JWT_SECRET } from './types';

passport.use(
    <passport.Strategy>new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            callbackURL: process.env.GOOGLE_CALLBACK_URL!,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails![0].value;
                let user = await User.findOne({email});

                if (!user) {
                    user = await User.create({
                        email,
                        name: profile.displayName!,
                        avatar: profile.photos![0].value!,
                        googleId: profile.id,
                    });
                }

                // @ts-ignore
                done(null, user);
            } catch (error: any) {
                done(error);
            }
        }
    )
);

passport.use(
    new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: JWT_SECRET,
        },
        async (jwtPayload, done) => {
            try {
                const user = await User.findById(jwtPayload.sub);

                if (!user) {
                    return done(null, false);
                }

                // @ts-ignore
                return done(null, user);
            } catch (error) {
                return done(error, false);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);

        if (!user) {
            return done(null, false);
        }

        // @ts-ignore
        return done(null, user);
    } catch (error) {
        return done(error, false);
    }
});

export default passport;
