import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider, createTheme, CssBaseline, Box } from "@mui/material";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import Register from "./components/Auth/Register";
import ReporteroDashboard from "./components/Reportero/ReporteroDashboard";
import EditorDashboard from "./components/Editor/EditorDashboard";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import NoticiaForm from "./components/Noticias/NoticiaForm";
import ListNoticias from "./components/ListNoticias/ListNoticias";
import NoticiaDetalle from "./components/NoticiaDetalle/NoticiasDetalle";
import GestionNoticias from "./components/GestionNoticias/GestionNoticias";
import EditarNoticia from "./components/EditarNoticia/EditarNoticia";
import Sections from "./components/Sections/Sections";

// Tema personalizado
const theme = createTheme({
  palette: {
    primary: {
      main: "#667eea",
    },
    secondary: {
      main: "#764ba2",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
            }}
          >
            <Header />

            <Box component="main" sx={{ flexGrow: 1 }}>
              <Routes>
                {/* Ruta pública principal */}
                <Route path="/" element={<Home />} />

                {/* Rutas de autenticación */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Ruta pública de detalle de noticia */}
                <Route path="/noticia/:id" element={<NoticiaDetalle />} />

                {/* Rutas protegidas - Reportero */}
                <Route
                  path="/reportero/dashboard"
                  element={
                    <ProtectedRoute requiredRole="reportero">
                      <ReporteroDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reportero/crear-noticia"
                  element={
                    <ProtectedRoute requiredRole="reportero">
                      <NoticiaForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reportero/editar-noticia/:id"
                  element={
                    <ProtectedRoute requiredRole="reportero">
                      <NoticiaForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reportero/list-noticias"
                  element={
                    <ProtectedRoute requiredRole="reportero">
                      <ListNoticias />
                    </ProtectedRoute>
                  }
                />

                {/* Rutas protegidas - Editor */}
                <Route
                  path="/editor/dashboard"
                  element={
                    <ProtectedRoute requiredRole="editor">
                      <EditorDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/editor/gestion-noticias"
                  element={
                    <ProtectedRoute requiredRole="editor">
                      <GestionNoticias />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/editor/editar-noticia/:id"
                  element={
                    <ProtectedRoute requiredRole="editor">
                      <EditarNoticia />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/editor/secciones"
                  element={
                    <ProtectedRoute requiredRole="editor">
                      <Sections />
                    </ProtectedRoute>
                  }
                />

                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Box>
            <Footer />
          </Box>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;
