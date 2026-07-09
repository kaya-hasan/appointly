import React from "react";
import { NavLink } from "react-router-dom";
const appName = "Appointly";

const MainLayout = ({ children, language, setLanguage }) => {
  const menu = language === "tr"
    ? [
      { label: "Ana Sayfa", path: "/" },
      { label: "Müşteriler", path: "/customers" },
      { label: "Randevular", path: "/appointments" },
    ]
    : [
      { label: "Home", path: "/" },
      { label: "Customers", path: "/customers" },
      { label: "Appointments", path: "/appointments" },
    ];

  const eyebrowText =
    language === "tr" ? "Randevu Yönetimi" : "Appointment Management";

  const languageLabel = language === "tr" ? "Dil" : "Language";

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-top">
          <div className="language-switcher">
            <span className="language-label">{languageLabel}</span>
            <div className="language-toggle" role="group" aria-label={languageLabel}>
              <button
                type="button"
                className={language === "tr" ? "language-button active-language" : "language-button"}
                onClick={() => setLanguage("tr")}
              >
                TR
              </button>
              <button
                type="button"
                className={language === "en" ? "language-button active-language" : "language-button"}
                onClick={() => setLanguage("en")}
              >
                EN
              </button>
            </div>
          </div>
        </div>
        <div>
          <p className="app-eyebrow">{eyebrowText}</p>
          <h1 className="app-title">{appName}</h1>
        </div>
        <nav aria-label="Main navigation">
          <ul className="nav-list">
            {menu.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  {item.label}
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
