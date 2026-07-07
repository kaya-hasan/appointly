import React from "react";
import { NavLink } from "react-router-dom";
const appName = "Appointly";
const menu = ["Home", "Customers", "Appointments"];

const MainLayout = ({ children }) => {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="app-eyebrow">Appointment Management</p>
          <h1 className="app-title">{appName}</h1>
        </div>
        <nav aria-label="Main navigation">
          <ul className="nav-list">
            {menu.map((item) => (
              <li key={item}>
                <NavLink
                  to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  {item}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main className="page-content">{children}</main>
    </div>
  );
};

export default MainLayout;
