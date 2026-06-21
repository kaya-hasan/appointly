import React from "react";

const appName = "Appointly";
const menu = ["Home", "Customers", "Appointments"]

const MainLayout = ({ children }) => {
  return (
    <div>
      <h1>{appName}</h1>
      <h2>{menu.map((item) => item)}</h2>
      {children}
    </div>
  );
};

export default MainLayout;