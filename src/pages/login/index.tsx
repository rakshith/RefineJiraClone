import { AuthPage, ThemedTitleV2 } from "@refinedev/antd";
import { authCredentials } from "../../providers/auth";

export const Login = () => {
  return (
    <AuthPage
      type="login"
      title={<ThemedTitleV2 collapsed={false} text="Refine JIRA Clone" />}
      formProps={{
        initialValues: authCredentials,
      }}
    />
  );
};
