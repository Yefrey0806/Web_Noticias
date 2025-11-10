import React from "react";
import { Box, Container, Typography, Link, Grid } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import GitHubIcon from "@mui/icons-material/GitHub";
import "./Footer.css";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#1a1a2e",
        color: "white",
        py: 4,
        mt: "auto",
        marginTop: "10vh",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Portal de Noticias
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Hecho con amor por Yefrey Sanjuan y Yhonatan Calderon (y un poco
              de chat tambíen :v)
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Enlaces Rápidos
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link
                to="/"
                color="inherit"
                underline="hover"
                sx={{ opacity: 0.8 }}
              >
                Inicio
              </Link>
              <Link
                href="/login"
                color="inherit"
                underline="hover"
                sx={{ opacity: 0.8 }}
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/register"
                color="inherit"
                underline="hover"
                sx={{ opacity: 0.8 }}
              >
                Registrarse
              </Link>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Síguenos
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <IconButton
                component="a"
                href="https://github.com/Yefrey0806?tab=repositories"
                target="_blank"
                rel="noopener noreferrer"
                color="primary"
              >
                {" "}
                <GitHubIcon
                  sx={{ cursor: "pointer", "&:hover": { opacity: 0.7 } }}
                />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        <Box
          sx={{
            borderTop: "1px solid rgba(255,255,255,0.1)",
            mt: 4,
            pt: 3,
            textAlign: "center",
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            © {new Date().getFullYear()} Portal de Noticias. Todos los derechos
            reservados.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
