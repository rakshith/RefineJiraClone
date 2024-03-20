import { ThemedLayoutV2, ThemedTitleV2 } from "@refinedev/antd";
import React from "react";
import Header from "./header";

const Layout = ({ children }: React.PropsWithChildren) => {
  return (
    <ThemedLayoutV2
      Header={Header}
      Title={(titlePros) => <ThemedTitleV2 {...titlePros} text="Refine test" />}
    >
      {children}
    </ThemedLayoutV2>
  );
};

export default Layout;
