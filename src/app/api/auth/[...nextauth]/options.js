
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import FacebookProvider from "next-auth/providers/facebook";
import AppleProvider from "next-auth/providers/apple";
import { ConnectDb } from "@/helper/dbconnect";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";


export const authOptions = {
  providers: [
    CredentialsProvider({
        id: "credentials",
        name: "Credentials",
        credentials: {
          email: { label: "Email", type: "text" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          const dbConnection = await ConnectDb();
          try {
            const [rows] = await dbConnection.execute(
              `SELECT * FROM users WHERE email = ?`,
              [credentials.identifier]
            );
            const user = rows[0];
  
            if (!user) {
              throw new Error("User not found");
            }

            if(!user.isEmailVerified){
              throw new Error("Email is not verified")
              // return NextResponse.json({message : "Email is not verified"} , {status : 400})
            }
            const isPasswordCorrect = await bcrypt.compare(
              credentials.password,
              user.password
            );
            if (!isPasswordCorrect) {
              throw new Error("Invalid Password!")
            }
            if (isPasswordCorrect) {
              console.log("userID" , user.user_id)
              return { ...user , id : user.user_id};
            } else {
              throw new Error("Invalid credentials");
            }
          } catch (error) {
            throw new Error(error.message);
          } finally {
            if(dbConnection){
             dbConnection.end()
            }
          }
        },
      })
    ,
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
    // AppleProvider({
    //   clientId: process.env.APPLE_CLIENT_ID,
    //   teamId: process.env.APPLE_TEAM_ID,
    //   keyId: process.env.APPLE_KEY_ID,
    //   privateKey: process.env.APPLE_PRIVATE_KEY.replace(/\\n/g, '\n')
    // }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: '/signin', 
    signUp: '/signup', 
  },

  session: {
    strategy: 'jwt',
  },

  callbacks: {

    async signIn({ user, account, profile }) {
      const dbConnection = await ConnectDb();

      try {
        const [existingUser] = await dbConnection.execute(
          `SELECT * FROM users WHERE email = ?`,
          [user.email]
        );
              
        // console.log("existing user " , existingUser)

        if (existingUser.length === 0) {
          const query = `
            INSERT INTO users (full_name , email , provider, provider_id) 
            VALUES (?, ?, ?, ?)
          `;

          
          const { email, name } = user;
          const providerId = account.providerAccountId; 
          const provider = account.provider; 

          const [result] = await dbConnection.execute(query, [
            name,
            email,
            provider,
            providerId,
          ]);
          // console.log("result ----", result)

          user.id = result.insertId
          // console.log("userid ---", user.id)


          console.log(`New user registered with ${provider}`);
        }else{
          user.id = existingUser[0].user_id
        }
        return true; 
      } catch (error) {
        console.error("Error registering user:", error);
        return false; 
      } finally {
        if (dbConnection) {
          dbConnection.end();
        }
      }
    },

    async jwt({ token, account , user}) {
      
      if (account) {
        token.accessToken = account.access_token;
      }
      if (user) {
        token.userId = user.id;
        console.log("token from the option file" , token) 
      }
      return token;
    },
    async session({ session, token }) {
      
     if(token){
      session.user = {
        userId: token.userId,
      };
      
      console.log("session userId options" , session)
     }
      return session;
    },
  },

  
};
