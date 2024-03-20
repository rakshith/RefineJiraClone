import { AuthProvider } from "@refinedev/core";
import { API_URL, dataProvider } from "./data";
import { User } from "@/graphql/schema.types";
import { enableAutoLogin } from "@/hooks/useAutoLoginForDemo";

export const emails = [
  "michael.scott@dundermifflin.com",
  "jim.halpert@dundermifflin.com",
  "pam.beesly@dundermifflin.com",
  "dwight.schrute@dundermifflin.com",
  "angela.martin@dundermifflin.com",
  "stanley.hudson@dundermifflin.com",
  "phyllis.smith@dundermifflin.com",
  "kevin.malone@dundermifflin.com",
  "oscar.martinez@dundermifflin.com",
  "creed.bratton@dundermifflin.com",
  "meredith.palmer@dundermifflin.com",
  "ryan.howard@dundermifflin.com",
  "kelly.kapoor@dundermifflin.com",
  "andy.bernard@dundermifflin.com",
  "toby.flenderson@dundermifflin.com",
];

const randomEmail = emails[Math.floor(Math.random() * emails.length)];

/**
 * For demo purposes and to make it easier to test the app, you can use the following credentials:
 */
export const authCredentials = {
  email: randomEmail,
  password: "demodemo",
};

export const authProvider: AuthProvider = {
  login: async ({ email }) => {
    try {
      const { data } = await dataProvider.custom({
        url: API_URL,
        method: "post",
        headers: {},
        meta: {
          variables: { email },
          rawQuery: `
                mutation Login($email: String!) {
                    login(loginInput: {
                      email: $email
                    }) {
                      accessToken,
                    }
                  }
                `,
        },
      });

      localStorage.setItem("access_token", data.login.accessToken);

      return {
        success: true,
        redirectTo: "/",
      };
    } catch (e) {
      const error = e as Error;

      return {
        success: false,
        error: {
          message: "message" in error ? error.message : "Login failed",
          name: "name" in error ? error.name : "Invalid email or password",
        },
      };
    }
  },
  register: async ({ email, password }) => {
    try {
      await dataProvider.custom({
        url: API_URL,
        method: "post",
        headers: {},
        meta: {
          variables: { email, password },
          rawQuery: `
                mutation register($email: String!, $password: String!) {
                    register(registerInput: {
                      email: $email
                        password: $password
                    }) {
                        id
                        email
                    }
                  }
                `,
        },
      });

      enableAutoLogin(email);

      return {
        success: true,
        redirectTo: `/login?email=${email}`,
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: "message" in error ? error.message : "Register failed",
          name: "name" in error ? error.name : "Invalid email or password",
        },
      };
    }
  },
  logout: async () => {
    localStorage.removeItem("access_token");

    return {
      success: true,
      redirectTo: "/login",
    };
  },
  onError: async (error) => {
    if (error.statusCode === "UNAUTHENTICATED") {
      return {
        logout: true,
      };
    }

    return { error };
  },
  check: async () => {
    try {
      await dataProvider.custom({
        url: API_URL,
        method: "post",
        headers: {},
        meta: {
          rawQuery: `
                    query Me {
                        me {
                          name
                        }
                      }
                `,
        },
      });

      return {
        authenticated: true,
        redirectTo: "/",
      };
    } catch (error) {
      return {
        authenticated: false,
        redirectTo: "/login",
      };
    }
  },
  getIdentity: async () => {
    const accessToken = localStorage.getItem("access_token");

    try {
      const { data } = await dataProvider.custom<{ me: User }>({
        url: API_URL,
        method: "post",
        headers: accessToken
          ? {
              Authorization: `Bearer ${accessToken}`,
            }
          : {},
        meta: {
          rawQuery: `
                    query Me {
                        me {
                            id,
                            name,
                            email,
                            phone,
                            jobTitle,
                            timezone
                            avatarUrl
                        }
                      }
                `,
        },
      });

      return data.me;
    } catch (error) {
      return undefined;
    }
  },
};
