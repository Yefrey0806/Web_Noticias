import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Container,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import "./Header.css";

const Header = () => {
  const { user, userRole, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenu = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMobileMenuAnchor(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
      handleClose();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const goToDashboard = () => {
    if (userRole === "reportero") {
      navigate("/reportero/dashboard");
    } else if (userRole === "editor") {
      navigate("/editor/dashboard");
    }
    handleClose();
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        background: "linear-gradient(135deg, #6694eaff 0%, #4ba281ff 100%)",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          {/* Logo */}
          <NewspaperIcon
            sx={{ display: { xs: "none", md: "flex" }, mr: 1, fontSize: 30 }}
          />
          <Typography
            variant="h6"
            noWrap
            component="div"
            onClick={() => navigate("/")}
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: ".1rem",
            }}
          >
            NOTICIAS UDLA
          </Typography>

          {/* Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton size="large" onClick={handleMobileMenu} color="inherit">
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={mobileMenuAnchor}
              open={Boolean(mobileMenuAnchor)}
              onClose={handleClose}
            >
              <MenuItem
                onClick={() => {
                  navigate("/");
                  handleClose();
                }}
              >
                Inicio
              </MenuItem>
              {user && <MenuItem onClick={goToDashboard}>Dashboard</MenuItem>}
            </Menu>
          </Box>

          {/* Logo Mobile */}
          <NewspaperIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="div"
            onClick={() => navigate("/")}
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            NOTICIAS
          </Typography>

          {/* Desktop Menu */}
          <Box
            sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, gap: 2 }}
          >
            <Button
              color="inherit"
              onClick={() => navigate("/")}
              sx={{ fontWeight: 600 }}
            >
              Inicio
            </Button>
            {user && (
              <Button
                color="inherit"
                onClick={goToDashboard}
                sx={{ fontWeight: 600 }}
              >
                Panel
              </Button>
            )}
          </Box>

          {/* User Menu */}
          <Box sx={{ flexGrow: 0 }}>
            {user ? (
              <>
                <IconButton size="large" onClick={handleMenu} color="inherit">
                  <AccountCircle />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem disabled>
                    <Typography variant="body2" color="text.secondary">
                      {user.email}
                    </Typography>
                  </MenuItem>
                  <MenuItem disabled>
                    <Typography variant="caption" color="primary">
                      Rol: {userRole}
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
                    Cerrar Sesión
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  color="inherit"
                  onClick={() => navigate("/login")}
                  variant="outlined"
                  sx={{
                    borderColor: "white",
                    "&:hover": {
                      borderColor: "white",
                      backgroundColor: "rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  Iniciar Sesión
                </Button>
                <Button
                  color="inherit"
                  onClick={() => navigate("/register")}
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.2)",
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.3)" },
                  }}
                >
                  Registrarse
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
