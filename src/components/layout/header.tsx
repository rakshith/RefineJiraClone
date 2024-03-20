import React from "react";
import CurrentUser from "./current-user";
import { Layout, Space } from "antd";

const Header = () => {
  const headeStyles: React.CSSProperties = {
    background: "#fff",
    display: "flex",
    justifyContent: "flex-end",
    padding: "0 24px",
    position: "sticky",
    top: 0,
    zIndex: 999,
  };
  return (
    <Layout.Header style={headeStyles}>
      <Space align="center" size={"middle"}>
        <CurrentUser />
      </Space>
    </Layout.Header>
  );
};

export default Header;
