import React from "react";

const appName = "Appointly";
const menu = ["Home", "Customers", "Appointments"];

const MainLayout = ({ children }) => {
  return (
    <div>
      <header>
        <h1>{appName}</h1>
        <nav aria-label="Main navigation">
          <ul>
            {menu.map((item) => (
              <li key={item}>
                <button type="button">{item}</button>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
};

export default MainLayout;
