import React, { useState } from "react";
import {
  Box,
  Container,
  AppBar,
  Toolbar,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
  Chip,
  Stack,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Person, PersonAdd, Favorite, CheckCircle } from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import PatientLogin from "./components/PatientLogin";
import PatientRegistration from "./components/PatientRegistration";

// Patient Portal Theme (Green)
const theme = createTheme({
  palette: {
    primary: {
      main: "#2e7d32",
      light: "#4caf50",
      dark: "#1b5e20",
    },
    secondary: {
      main: "#f1f8e9",
    },
    background: {
      default: "#f1f8e9",
    },
    success: {
      main: "#4caf50",
    },
  },
  typography: {
    fontFamily: "Inter, system-ui, sans-serif",
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
          borderRadius: 8,
        },
      },
    },
  },
});

function App() {
  const [activeComponent, setActiveComponent] = useState("login");

  const components = {
    login: {
      title: "Patient Login",
      icon: Person,
      component: PatientLogin,
      description:
        "Secure patient authentication with enhanced healthcare features",
    },
    registration: {
      title: "Patient Registration",
      icon: PersonAdd,
      component: PatientRegistration,
      description:
        "Comprehensive patient registration with medical information",
    },
  };

  const ActiveComponent = components[activeComponent].component;

  const handleComponentChange = (event, newComponent) => {
    if (newComponent !== null) {
      setActiveComponent(newComponent);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        {/* Navigation Header */}
        <AppBar position="static" elevation={1} color="inherit">
          <Container maxWidth="xl">
            <Toolbar sx={{ py: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
                <Favorite sx={{ color: "primary.main", mr: 2, fontSize: 32 }} />
                <Box>
                  <Typography variant="h5" component="h1" fontWeight={700}>
                    Patient Portal
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Your Health, Your Care
                  </Typography>
                </Box>
              </Box>

              <ToggleButtonGroup
                value={activeComponent}
                exclusive
                onChange={handleComponentChange}
                size="small"
                sx={{ bgcolor: "grey.100", borderRadius: 2 }}
              >
                {Object.entries(components).map(([key, component]) => {
                  const Icon = component.icon;
                  return (
                    <ToggleButton
                      key={key}
                      value={key}
                      sx={{
                        px: 2,
                        py: 1,
                        border: "none !important",
                        "&.Mui-selected": {
                          bgcolor: "primary.main",
                          color: "white",
                          "&:hover": {
                            bgcolor: "primary.dark",
                          },
                        },
                      }}
                    >
                      <Icon sx={{ mr: { xs: 0, sm: 1 }, fontSize: 20 }} />
                      <Typography
                        variant="body2"
                        sx={{ display: { xs: "none", sm: "block" } }}
                      >
                        {component.title}
                      </Typography>
                    </ToggleButton>
                  );
                })}
              </ToggleButtonGroup>
            </Toolbar>
          </Container>
        </AppBar>

        {/* Component Description */}
        <Container maxWidth="xl" sx={{ py: 2 }}>
          <Paper
            sx={{
              p: 2,
              bgcolor: "primary.50",
              border: "1px solid",
              borderColor: "primary.200",
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Chip
                label={components[activeComponent].title}
                color="primary"
                variant="filled"
                size="small"
              />
              <Typography variant="body2" color="primary.dark">
                {components[activeComponent].description}
              </Typography>
            </Stack>
          </Paper>
        </Container>

        {/* Component Display Area */}
        <Box sx={{ position: "relative" }}>
          <ActiveComponent />
        </Box>

        {/* Features Showcase - Only show on login page */}
        {activeComponent === "login" && (
          <Card
            sx={{
              position: "fixed",
              bottom: 16,
              left: 16,
              width: { xs: "calc(100% - 32px)", lg: 320 },
              maxWidth: 320,
              zIndex: 1000,
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Patient Features
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Person color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Secure Patient Login"
                    primaryTypographyProps={{ variant: "body2" }}
                  />
                  <CheckCircle color="success" fontSize="small" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <PersonAdd color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Comprehensive Registration"
                    primaryTypographyProps={{ variant: "body2" }}
                  />
                  <CheckCircle color="success" fontSize="small" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Favorite color="error" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Medical Information Management"
                    primaryTypographyProps={{ variant: "body2" }}
                  />
                  <CheckCircle color="success" fontSize="small" />
                </ListItem>
              </List>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1, display: "block" }}
              >
                Use the navigation above to switch between components
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>
    </ThemeProvider>
  );
}

export default App;
