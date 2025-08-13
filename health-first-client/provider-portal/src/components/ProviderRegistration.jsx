import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  AlertTitle,
  CircularProgress,
  IconButton,
  InputAdornment,
  Container,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Grid,
  Stack,
  Divider,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Person,
  Email,
  Phone,
  Home,
  Lock,
  Business,
  School,
  CheckCircle,
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Provider Portal Theme (Blue)
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
      light: "#42a5f5",
      dark: "#1565c0",
    },
    secondary: {
      main: "#f5f5f5",
    },
    background: {
      default: "#f8fafc",
    },
  },
  typography: {
    fontFamily: "Inter, system-ui, sans-serif",
    h4: {
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
    MuiStepper: {
      styleOverrides: {
        root: {
          padding: "24px 0",
        },
      },
    },
  },
});

const ProviderRegistration = () => {
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",

    // Professional Information
    specialization: "",
    medicalLicenseNumber: "",
    yearsOfExperience: "",

    // Clinic Address
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",

    // Account Security
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState("");
  const [currentStep, setCurrentStep] = useState(0);

  // Specialization options
  const specializations = [
    "Cardiology",
    "Dermatology",
    "Emergency Medicine",
    "Family Medicine",
    "Internal Medicine",
    "Neurology",
    "Oncology",
    "Orthopedics",
    "Pediatrics",
    "Psychiatry",
    "Radiology",
    "Surgery",
    "Other",
  ];

  // Steps configuration
  const steps = [
    "Personal Information",
    "Professional Information",
    "Clinic Address",
    "Account Security",
  ];

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ""));
  };

  const validateLicenseNumber = (license) => {
    const licenseRegex = /^[A-Z0-9]{6,15}$/;
    return licenseRegex.test(license);
  };

  const validateZipCode = (zip) => {
    const zipRegex = /^[0-9]{5}(-[0-9]{4})?$/;
    return zipRegex.test(zip);
  };

  const validatePassword = (password) => {
    return (
      password.length >= 8 &&
      /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(
        password
      )
    );
  };

  // Real-time validation
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear previous errors
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    // Real-time validation
    switch (name) {
      case "email":
        if (value && !validateEmail(value)) {
          setErrors((prev) => ({
            ...prev,
            email: "Please enter a valid email address",
          }));
        }
        break;
      case "phoneNumber":
        if (value && !validatePhone(value)) {
          setErrors((prev) => ({
            ...prev,
            phoneNumber: "Please enter a valid phone number",
          }));
        }
        break;
      case "medicalLicenseNumber":
        if (value && !validateLicenseNumber(value)) {
          setErrors((prev) => ({
            ...prev,
            medicalLicenseNumber:
              "License number must be 6-15 alphanumeric characters",
          }));
        }
        break;
      case "zipCode":
        if (value && !validateZipCode(value)) {
          setErrors((prev) => ({
            ...prev,
            zipCode: "Please enter a valid ZIP code",
          }));
        }
        break;
      case "password":
        if (value && !validatePassword(value)) {
          setErrors((prev) => ({
            ...prev,
            password:
              "Password must be at least 8 characters with uppercase, lowercase, number, and special character",
          }));
        }
        break;
      case "confirmPassword":
        if (value && value !== formData.password) {
          setErrors((prev) => ({
            ...prev,
            confirmPassword: "Passwords do not match",
          }));
        }
        break;
      default:
        break;
    }
  };

  // Validate current step
  const validateStep = (step) => {
    const newErrors = {};

    if (step === 0) {
      // Personal Information validation
      if (!formData.firstName || formData.firstName.length < 2) {
        newErrors.firstName = "First name must be at least 2 characters";
      }
      if (!formData.lastName || formData.lastName.length < 2) {
        newErrors.lastName = "Last name must be at least 2 characters";
      }
      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!validateEmail(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
      if (!formData.phoneNumber) {
        newErrors.phoneNumber = "Phone number is required";
      } else if (!validatePhone(formData.phoneNumber)) {
        newErrors.phoneNumber = "Please enter a valid phone number";
      }
    }

    if (step === 1) {
      // Professional Information validation
      if (!formData.specialization || formData.specialization.length < 3) {
        newErrors.specialization =
          "Specialization must be at least 3 characters";
      }
      if (!formData.medicalLicenseNumber) {
        newErrors.medicalLicenseNumber = "Medical license number is required";
      } else if (!validateLicenseNumber(formData.medicalLicenseNumber)) {
        newErrors.medicalLicenseNumber =
          "License number must be 6-15 alphanumeric characters";
      }
      if (
        !formData.yearsOfExperience ||
        formData.yearsOfExperience < 0 ||
        formData.yearsOfExperience > 50
      ) {
        newErrors.yearsOfExperience =
          "Years of experience must be between 0 and 50";
      }
    }

    if (step === 2) {
      // Address validation
      if (!formData.streetAddress) {
        newErrors.streetAddress = "Street address is required";
      }
      if (!formData.city) {
        newErrors.city = "City is required";
      }
      if (!formData.state) {
        newErrors.state = "State is required";
      }
      if (!formData.zipCode) {
        newErrors.zipCode = "ZIP code is required";
      } else if (!validateZipCode(formData.zipCode)) {
        newErrors.zipCode = "Please enter a valid ZIP code";
      }
    }

    if (step === 3) {
      // Password validation
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (!validatePassword(formData.password)) {
        newErrors.password =
          "Password must be at least 8 characters with uppercase, lowercase, number, and special character";
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.confirmPassword !== formData.password) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(3)) {
      return;
    }

    setIsLoading(true);
    setRegistrationStatus("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 3000));

      setRegistrationStatus("success");
    } catch (error) {
      setRegistrationStatus("error");
      setErrors({
        general: error.message || "Registration failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={3}>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="action" />
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Enter first name"
                  inputProps={{ maxLength: 50 }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="action" />
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Enter last name"
                  inputProps={{ maxLength: 50 }}
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              error={!!errors.email}
              helperText={errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
              placeholder="Enter email address"
            />

            <TextField
              fullWidth
              label="Phone Number"
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone color="action" />
                  </InputAdornment>
                ),
              }}
              placeholder="Enter phone number"
            />
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={3}>
            <Typography variant="h6" gutterBottom>
              Professional Information
            </Typography>

            <FormControl fullWidth error={!!errors.specialization}>
              <InputLabel>Specialization</InputLabel>
              <Select
                name="specialization"
                value={formData.specialization}
                onChange={handleInputChange}
                label="Specialization"
                startAdornment={
                  <InputAdornment position="start">
                    <School color="action" />
                  </InputAdornment>
                }
              >
                {specializations.map((spec) => (
                  <MenuItem key={spec} value={spec}>
                    {spec}
                  </MenuItem>
                ))}
              </Select>
              {errors.specialization && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ mt: 1, ml: 2 }}
                >
                  {errors.specialization}
                </Typography>
              )}
            </FormControl>

            <TextField
              fullWidth
              label="Medical License Number"
              name="medicalLicenseNumber"
              value={formData.medicalLicenseNumber}
              onChange={handleInputChange}
              error={!!errors.medicalLicenseNumber}
              helperText={errors.medicalLicenseNumber}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Business color="action" />
                  </InputAdornment>
                ),
              }}
              placeholder="Enter medical license number"
              inputProps={{ style: { textTransform: "uppercase" } }}
            />

            <TextField
              fullWidth
              label="Years of Experience"
              name="yearsOfExperience"
              type="number"
              value={formData.yearsOfExperience}
              onChange={handleInputChange}
              error={!!errors.yearsOfExperience}
              helperText={errors.yearsOfExperience}
              placeholder="Enter years of experience"
              inputProps={{ min: 0, max: 50 }}
            />
          </Stack>
        );

      case 2:
        return (
          <Stack spacing={3}>
            <Typography variant="h6" gutterBottom>
              Clinic Address
            </Typography>

            <TextField
              fullWidth
              label="Street Address"
              name="streetAddress"
              value={formData.streetAddress}
              onChange={handleInputChange}
              error={!!errors.streetAddress}
              helperText={errors.streetAddress}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Home color="action" />
                  </InputAdornment>
                ),
              }}
              placeholder="Enter street address"
              inputProps={{ maxLength: 200 }}
            />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  error={!!errors.city}
                  helperText={errors.city}
                  placeholder="Enter city"
                  inputProps={{ maxLength: 100 }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  error={!!errors.state}
                  helperText={errors.state}
                  placeholder="Enter state"
                  inputProps={{ maxLength: 50 }}
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth
              label="ZIP/Postal Code"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleInputChange}
              error={!!errors.zipCode}
              helperText={errors.zipCode}
              placeholder="Enter ZIP code"
            />
          </Stack>
        );

      case 3:
        return (
          <Stack spacing={3}>
            <Typography variant="h6" gutterBottom>
              Account Security
            </Typography>

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleInputChange}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              placeholder="Enter password"
            />

            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleInputChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              placeholder="Confirm password"
            />

            <Alert severity="info">
              Password must contain at least 8 characters with uppercase,
              lowercase, number, and special character
            </Alert>
          </Stack>
        );

      default:
        return null;
    }
  };

  if (registrationStatus === "success") {
    return (
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            py: 3,
          }}
        >
          <Container maxWidth="sm">
            <Card sx={{ p: 4, textAlign: "center" }}>
              <CardContent>
                <CheckCircle
                  sx={{ fontSize: 64, color: "success.main", mb: 2 }}
                />
                <Typography variant="h4" component="h1" gutterBottom>
                  Registration Successful!
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  Your provider account has been created successfully. You can
                  now log in to access your dashboard.
                </Typography>
                <Button
                  variant="contained"
                  color="success"
                  size="large"
                  onClick={() => (window.location.href = "/login")}
                >
                  Go to Login
                </Button>
              </CardContent>
            </Card>
          </Container>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
          py: 4,
        }}
      >
        <Container maxWidth="md">
          <Card sx={{ overflow: "hidden" }}>
            {/* Header */}
            <Paper sx={{ bgcolor: "primary.main", color: "white", p: 3 }}>
              <Typography
                variant="h4"
                component="h1"
                align="center"
                gutterBottom
              >
                Provider Registration
              </Typography>
              <Typography variant="body1" align="center" sx={{ opacity: 0.9 }}>
                Join our healthcare network
              </Typography>
            </Paper>

            {/* Stepper */}
            <Box sx={{ p: 3, bgcolor: "grey.50" }}>
              <Stepper activeStep={currentStep} alternativeLabel>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>

            {/* Form Content */}
            <CardContent sx={{ p: 4 }}>
              {/* General Error Message */}
              {errors.general && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  <AlertTitle>Error</AlertTitle>
                  {errors.general}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                {renderStepContent(currentStep)}

                {/* Navigation Buttons */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 4,
                  }}
                >
                  <Button
                    onClick={handleBack}
                    disabled={currentStep === 0}
                    variant="outlined"
                  >
                    Back
                  </Button>

                  {currentStep === steps.length - 1 ? (
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={isLoading}
                      startIcon={
                        isLoading ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : null
                      }
                    >
                      {isLoading ? "Registering..." : "Register"}
                    </Button>
                  ) : (
                    <Button onClick={handleNext} variant="contained">
                      Next
                    </Button>
                  )}
                </Box>
              </Box>
            </CardContent>

            {/* Footer */}
            <Divider />
            <Box sx={{ p: 2, bgcolor: "grey.50", textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{" "}
                <Button variant="text" size="small">
                  Sign in here
                </Button>
              </Typography>
            </Box>
          </Card>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default ProviderRegistration;
