import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  where,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  CircularProgress,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import "./Home.css";

const Home = () => {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [seccionSeleccionada, setSeccionSeleccionada] = useState("todas");
  const [secciones, setSecciones] = useState(["todas"]);
  const [loadingSecciones, setLoadingSecciones] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNoticias();
  }, []);

  useEffect(() => {
    fetchSecciones();
  }, []);

  const fetchNoticias = async () => {
    try {
      const noticiasRef = collection(db, "noticias");
      const q = query(noticiasRef, orderBy("createdAt", "desc"), limit(12));
      const querySnapshot = await getDocs(q);

      const noticiasData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const noticiasPublicadas = noticiasData.filter(
        (noticia) => noticia.estado === "publicada"
      );

      setNoticias(noticiasPublicadas);
    } catch (error) {
      console.error("Error al obtener noticias:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSecciones = async () => {
    try {
      setLoadingSecciones(true);
      const seccionesRef = collection(db, "secciones");
      const querySnapshot = await getDocs(seccionesRef);

      const seccionesData = ["todas"];

      querySnapshot.forEach((doc) => {
        const data = doc.data();

        if (data.nombre) {
          seccionesData.push(data.nombre.toLowerCase());
        }
      });

      setSecciones(seccionesData);
    } catch (error) {
      console.error("Error al cargar secciones:", error);
      // Cargar secciones por defecto hay falla
      setSecciones([
        "todas",
        "política",
        "deportes",
        "economía",
        "tecnología",
        "cultura",
      ]);
    } finally {
      setLoadingSecciones(false);
    }
  };

  {
    // Consulta para traer solo noticias publicadas, Opcion 2
    /* const fetchNoticias = async () => {
  try {
    const noticiasRef = collection(db, "noticias");
    
    const q = query(
      noticiasRef,
      where("estado", "==", "publicada"),
      orderBy("createdAt", "desc"),
      limit(12)
    );
    
    const querySnapshot = await getDocs(q);

    const noticiasData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setNoticias(noticiasData);
  } catch (error) {
    console.error("Error al obtener noticias:", error);
  } finally {
    setLoading(false);
  }
}; */
  }

  const filteredNoticias = noticias.filter((noticia) => {
    const matchesSearch =
      noticia.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      noticia.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      noticia.categoria?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSection =
      seccionSeleccionada === "todas" ||
      noticia.categoria?.toLowerCase() === seccionSeleccionada.toLowerCase();

    return matchesSearch && matchesSection;
  });

  const formatDate = (timestamp) => {
    if (!timestamp) return "Fecha no disponible";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
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

  return (
    <div className="home-container">
      {/* Hero Home */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #6694eaff 10%, #4ba281ff 100%)",
          color: "white",
          py: 8,
          mb: 4,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            fontWeight="bold"
            gutterBottom
            align="center"
          >
            Portal de Noticias
          </Typography>
          <Typography variant="h5" align="center" sx={{ mb: 4, opacity: 0.9 }}>
            Mantente informado con las últimas noticias
          </Typography>

          {/* Buscador */}
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <TextField
              variant="outlined"
              placeholder="Buscar noticias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                backgroundColor: "white",
                borderRadius: 2,
                width: "100%",
                maxWidth: 600,
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/*Filtro por secciones */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: 2,
              mt: 3,
              marginTop: 4,
            }}
          >
            {loadingSecciones ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              secciones.map((seccion) => (
                <Chip
                  key={seccion}
                  label={seccion.charAt(0).toUpperCase() + seccion.slice(1)}
                  clickable
                  color={
                    seccionSeleccionada === seccion ? "primary" : "default"
                  }
                  onClick={() => setSeccionSeleccionada(seccion)}
                  sx={{ fontSize: 14 }}
                />
              ))
            )}
          </Box>
        </Container>
      </Box>

      {/* Grid de Noticias */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        {filteredNoticias.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h5" color="text.secondary">
              {searchTerm
                ? "No se encontraron noticias"
                : "No hay noticias disponibles"}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
              {searchTerm
                ? "Intenta con otros términos de búsqueda"
                : "Vuelve pronto para ver nuevas publicaciones"}
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredNoticias.map((noticia) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={noticia.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={
                      noticia.imagenUrl ||
                      "https://via.placeholder.com/400x200?text=Sin+Imagen"
                    }
                    alt={noticia.titulo}
                    sx={{ objectFit: "cover" }}
                  />

                  <CardContent sx={{ flexGrow: 1 }}>
                    {noticia.categoria && (
                      <Chip
                        label={noticia.categoria}
                        size="small"
                        color="success"
                        sx={{ mb: 1 }}
                      />
                    )}

                    <Typography
                      gutterBottom
                      variant="h6"
                      component="h2"
                      sx={{
                        fontWeight: "bold",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {noticia.titulo}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {noticia.descripcion}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mt: 2,
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <CalendarTodayIcon
                          sx={{ fontSize: 16, color: "text.secondary" }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(noticia.createdAt)}
                        </Typography>
                      </Box>

                      {noticia.autor && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <PersonIcon
                            sx={{ fontSize: 16, color: "text.secondary" }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {noticia.autor}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </CardContent>

                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      size="small"
                      variant="contained"
                      fullWidth
                      onClick={() => navigate(`/noticia/${noticia.id}`)}
                    >
                      Leer más
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </div>
  );
};

export default Home;
