import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const router = useRouter();
  const { login, register } = useAuth();

  const [isLogin, setIsLogin] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "usuario",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");

    const { name, email, password, role } = formData;

    if (!email || !password || (!isLogin && !name)) {
      setMessage("Completa todos los campos obligatorios.");
      return;
    }

    if (!validateEmail(email)) {
      setMessage("Ingresa un correo válido.");
      return;
    }

    if (password.length < 4) {
      setMessage("La contraseña debe tener al menos 4 caracteres.");
      return;
    }

    if (isLogin) {
      const result = login(email, password);

      if (result.success) {
        setMessage("Inicio de sesión exitoso.");
        router.push("/dashboard");
      } else {
        setMessage(result.message);
      }
    } else {
      const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        role,
      };

      const result = register(newUser);

      if (result.success) {
        setMessage("Usuario registrado correctamente. Ahora inicia sesión.");
        setIsLogin(true);
        setFormData({
          name: "",
          email: "",
          password: "",
          role: "usuario",
        });
      } else {
        setMessage(result.message);
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>
          {isLogin ? "Iniciar Sesión" : "Registrarse"}
        </h1>

        <form onSubmit={handleSubmit} style={styles.form}>
          {!isLogin && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Nombre"
                value={formData.name}
                onChange={handleChange}
                style={styles.input}
              />

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="usuario">Usuario</option>
                <option value="gerente">Gerente</option>
              </select>
            </>
          )}

          <input
            type="email"
            name="email"
            placeholder="Correo"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            {isLogin ? "Entrar" : "Registrar"}
          </button>
        </form>

        {message && <p style={styles.message}>{message}</p>}

        <p style={styles.switchText}>
          {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage("");
            }}
            style={styles.linkButton}
          >
            {isLogin ? "Regístrate" : "Inicia sesión"}
          </button>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
  },
  card: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "400px",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  button: {
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#0070f3",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
  },
  message: {
    marginTop: "15px",
    textAlign: "center",
    color: "#333",
  },
  switchText: {
    marginTop: "15px",
    textAlign: "center",
  },
  linkButton: {
    background: "none",
    border: "none",
    color: "#0070f3",
    cursor: "pointer",
    fontWeight: "bold",
  },
};