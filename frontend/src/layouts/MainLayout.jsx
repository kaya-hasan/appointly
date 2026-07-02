import React from "react";
import { NavLink } from "react-router-dom";
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
                <NavLink to={item === "Home" ? "/" : `/${item.toLowerCase()}`} className={({ isActive }) => isActive ? "active" : ""}>{item}</NavLink>
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
