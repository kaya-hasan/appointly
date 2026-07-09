import { useState } from "react";
import authService from "../services/authService";

const LoginPage = ({ language, onAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const content = language === "tr"
    ? {
      title: "Giriş Yap",
      description: "Devam etmek için hesabınla giriş yap veya yeni kullanıcı oluştur.",
      email: "E-posta",
      password: "Şifre",
      login: "Giriş Yap",
      register: "Kayıt Ol",
      loadingLogin: "Giriş yapılıyor...",
      loadingRegister: "Kayıt oluşturuluyor...",
      invalid: "Giriş başarısız.",
      registered: "Kayıt oluşturuldu. Şimdi giriş yapabilirsin.",
    }
    : {
      title: "Sign In",
      description: "Sign in with your account or create a new user to continue.",
      email: "Email",
      password: "Password",
      login: "Sign In",
      register: "Register",
      loadingLogin: "Signing in...",
      loadingRegister: "Creating account...",
      invalid: "Authentication failed.",
      registered: "Account created. You can sign in now.",
    };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await authService.login({ email, password });
      onAuthenticated();
    } catch (err) {
      setError(err.detail || content.invalid);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setError(null);
    setLoading(true);
    try {
      await authService.register({ email, password });
      setError(content.registered);
    } catch (err) {
      setError(err.detail || content.invalid);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="page">
          <h1>{content.title}</h1>
          <p className="page-description">{content.description}</p>
          {error && <p className={error === content.registered ? "empty-state" : "page-error"}>{error}</p>}

          <form className="entity-form auth-form" onSubmit={handleLogin}>
            <input
              type="email"
              placeholder={content.email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder={content.password}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button className="primary-button" type="submit" disabled={loading}>
              {loading ? content.loadingLogin : content.login}
            </button>
            <button className="secondary-button" type="button" onClick={handleRegister} disabled={loading}>
              {loading ? content.loadingRegister : content.register}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
