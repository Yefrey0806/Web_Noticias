import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import {
  Container,
  Paper,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Button,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import CategoryIcon from "@mui/icons-material/Category";

const NoticiaDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [noticia, setNoticia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchNoticia();
  }, [id]);

  const fetchNoticia = async () => {
    try {
      const docRef = doc(db, "noticias", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const noticiaData = {
          id: docSnap.id,
          ...docSnap.data(),
        };

        // Solo mostrar noticias publicadas
        if (noticiaData.estado === "publicada") {
          setNoticia(noticiaData);
        } else {
          setError("Esta noticia no está disponible públicamente");
        }
      } else {
        setError("Noticia no encontrada");
      }
    } catch (error) {
      console.error("Error al cargar noticia:", error);
      setError("Error al cargar la noticia");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Fecha no disponible";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error || !noticia) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h5" color="error" gutterBottom>
            {error || "Noticia no encontrada"}
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/editor/gestion-noticias")}
            sx={{ mt: 2 }}
          >
            Volver
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="md">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/")}
          sx={{ mb: 2 }}
        >
          Volver a Noticias
        </Button>

        <Paper elevation={3} sx={{ overflow: "hidden" }}>
          {/* Imagen Principal */}
          {noticia.imagenUrl && (
            <Box
              component="img"
              src={noticia.imagenUrl}
              alt={noticia.titulo}
              sx={{
                width: "100%",
                height: { xs: 250, sm: 350, md: 450 },
                objectFit: "cover",
              }}
            />
          )}

          {/* Contenido */}
          <Box sx={{ p: { xs: 3, sm: 4, md: 5 }, overflowWrap: "anywhere" }}>
            {/* Categoría */}
            <Box sx={{ mb: 2 }}>
              <Chip
                icon={<CategoryIcon />}
                label={noticia.categoria}
                color="primary"
                sx={{ fontWeight: "bold" }}
              />
            </Box>

            {/* Título */}
            <Typography
              variant="h3"
              component="h1"
              fontWeight="bold"
              gutterBottom
              sx={{
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                lineHeight: 1.2,
                mb: 2,
              }}
            >
              {noticia.titulo}
            </Typography>

            {/* Descripción */}
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                mb: 3,
                fontStyle: "italic",
                fontSize: { xs: "1rem", sm: "1.1rem" },
              }}
            >
              {noticia.descripcion}
            </Typography>

            {/* Metadata */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                mb: 3,
                pb: 3,
                borderBottom: "2px solid #e0e0e0",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <PersonIcon sx={{ fontSize: 20, color: "text.secondary" }} />
                <Typography variant="body2" color="text.secondary">
                  Por <strong>{noticia.autor}</strong>
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <CalendarTodayIcon
                  sx={{ fontSize: 18, color: "text.secondary" }}
                />
                <Typography variant="body2" color="text.secondary">
                  {formatDate(noticia.createdAt)}
                </Typography>
              </Box>
            </Box>

            {/* Contenido Principal */}
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: "1rem", sm: "1.1rem" },
                lineHeight: 1.8,
                textAlign: "justify",
                whiteSpace: "pre-wrap",
                color: "#333",
                overflow: "auto",

                maxHeight: "400px",
              }}
            >
              {noticia.contenido}
            </Typography>

            <Divider sx={{ my: 4 }} />

            {/* Estado y actualización de la noticia*/}
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Estado actual de la noticia: {noticia.estado}
              </Typography>
              {noticia.updatedAt && noticia.updatedAt !== noticia.createdAt && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mt: 1 }}
                >
                  Actualizado: {formatDate(noticia.updatedAt)}
                </Typography>
              )}
            </Box>
          </Box>
        </Paper>

        {/* Botón de retorno */}
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/")}
          >
            Ver Más Noticias
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default NoticiaDetalle;
