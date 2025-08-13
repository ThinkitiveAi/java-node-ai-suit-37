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
  Checkbox,
  FormControlLabel,
  Link,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Person,
  Email,
  Phone,
  Home,
  Lock,
  Favorite,
  Groups,
  LocalHospital,
  CheckCircle,
  CalendarToday,
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

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
  },
});

const PatientRegistration = () => {
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",

    // Address Information
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",

    // Emergency Contact
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelation: "",

    // Medical Information
    bloodType: "",
    allergies: "",
    currentMedications: "",
    medicalHistory: "",

    // Insurance Information
    insuranceProvider: "",
    insurancePolicyNumber: "",
    insuranceGroupNumber: "",

    // Account Security
    password: "",
    confirmPassword: "",

    // Agreements
    termsAccepted: false,
    privacyAccepted: false,
    communicationConsent: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState("");
  const [currentStep, setCurrentStep] = useState(0);

  // Options data
  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
    { value: "prefer-not-to-say", label: "Prefer not to say" },
  ];

  const bloodTypes = [
    "A+",
    "A-",
    "B+",
    "B-",
    "AB+",
    "AB-",
    "O+",
    "O-",
    "Unknown",
  ];

  const relationshipOptions = [
    "Parent",
    "Spouse",
    "Sibling",
    "Child",
    "Friend",
    "Other",
  ];

  // Steps configuration
  const steps = [
    "Personal Information",
    "Address Information",
    "Medical & Emergency",
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

  const validateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= 0 && age <= 150;
  };

  // Real-time validation
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: inputValue,
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
      case "emergencyContactPhone":
        if (value && !validatePhone(value)) {
          setErrors((prev) => ({
            ...prev,
            [name]: "Please enter a valid phone number",
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
      case "dateOfBirth":
        if (value && !validateAge(value)) {
          setErrors((prev) => ({
            ...prev,
            dateOfBirth: "Please enter a valid date of birth",
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
      // Personal Information
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
      if (!formData.dateOfBirth) {
        newErrors.dateOfBirth = "Date of birth is required";
      } else if (!validateAge(formData.dateOfBirth)) {
        newErrors.dateOfBirth = "Please enter a valid date of birth";
      }
      if (!formData.gender) {
        newErrors.gender = "Gender is required";
      }
    }

    if (step === 1) {
      // Address Information
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

    if (step === 2) {
      // Emergency Contact
      if (!formData.emergencyContactName) {
        newErrors.emergencyContactName = "Emergency contact name is required";
      }
      if (!formData.emergencyContactPhone) {
        newErrors.emergencyContactPhone = "Emergency contact phone is required";
      } else if (!validatePhone(formData.emergencyContactPhone)) {
        newErrors.emergencyContactPhone = "Please enter a valid phone number";
      }
      if (!formData.emergencyContactRelation) {
        newErrors.emergencyContactRelation = "Relationship is required";
      }
    }

    if (step === 3) {
      // Account Security & Agreements
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
      if (!formData.termsAccepted) {
        newErrors.termsAccepted = "You must accept the terms and conditions";
      }
      if (!formData.privacyAccepted) {
        newErrors.privacyAccepted = "You must accept the privacy policy";
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

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
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
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  error={!!errors.dateOfBirth}
                  helperText={errors.dateOfBirth}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarToday color="action" />
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>

            <FormControl fullWidth error={!!errors.gender}>
              <InputLabel>Gender</InputLabel>
              <Select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                label="Gender"
              >
                {genderOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.gender && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ mt: 1, ml: 2 }}
                >
                  {errors.gender}
                </Typography>
              )}
            </FormControl>
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={3}>
            <Typography variant="h6" gutterBottom>
              Address Information
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

      case 2:
        return (
          <Stack spacing={3}>
            <Typography variant="h6" gutterBottom>
              Emergency Contact & Medical Information
            </Typography>

            {/* Emergency Contact */}
            <Paper sx={{ p: 3, bgcolor: "grey.50" }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Emergency Contact
              </Typography>

              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Contact Name"
                  name="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={handleInputChange}
                  error={!!errors.emergencyContactName}
                  helperText={errors.emergencyContactName}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Groups color="action" />
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Enter emergency contact name"
                />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Contact Phone"
                      name="emergencyContactPhone"
                      type="tel"
                      value={formData.emergencyContactPhone}
                      onChange={handleInputChange}
                      error={!!errors.emergencyContactPhone}
                      helperText={errors.emergencyContactPhone}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone color="action" />
                          </InputAdornment>
                        ),
                      }}
                      placeholder="Enter contact phone"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl
                      fullWidth
                      error={!!errors.emergencyContactRelation}
                    >
                      <InputLabel>Relationship</InputLabel>
                      <Select
                        name="emergencyContactRelation"
                        value={formData.emergencyContactRelation}
                        onChange={handleInputChange}
                        label="Relationship"
                      >
                        {relationshipOptions.map((relation) => (
                          <MenuItem key={relation} value={relation}>
                            {relation}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.emergencyContactRelation && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{ mt: 1, ml: 2 }}
                        >
                          {errors.emergencyContactRelation}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>
                </Grid>
              </Stack>
            </Paper>

            {/* Medical Information */}
            <Paper sx={{ p: 3, bgcolor: "primary.50" }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Medical Information (Optional)
              </Typography>

              <Stack spacing={2}>
                <FormControl fullWidth>
                  <InputLabel>Blood Type</InputLabel>
                  <Select
                    name="bloodType"
                    value={formData.bloodType}
                    onChange={handleInputChange}
                    label="Blood Type"
                  >
                    {bloodTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Allergies"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleInputChange}
                  multiline
                  rows={2}
                  placeholder="List any known allergies..."
                />

                <TextField
                  fullWidth
                  label="Current Medications"
                  name="currentMedications"
                  value={formData.currentMedications}
                  onChange={handleInputChange}
                  multiline
                  rows={2}
                  placeholder="List current medications..."
                />
              </Stack>
            </Paper>

            {/* Insurance Information */}
            <Paper sx={{ p: 3, bgcolor: "success.50" }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Insurance Information (Optional)
              </Typography>

              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Insurance Provider"
                  name="insuranceProvider"
                  value={formData.insuranceProvider}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocalHospital color="action" />
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Enter insurance provider"
                />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Policy Number"
                      name="insurancePolicyNumber"
                      value={formData.insurancePolicyNumber}
                      onChange={handleInputChange}
                      placeholder="Enter policy number"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Group Number"
                      name="insuranceGroupNumber"
                      value={formData.insuranceGroupNumber}
                      onChange={handleInputChange}
                      placeholder="Enter group number"
                    />
                  </Grid>
                </Grid>
              </Stack>
            </Paper>
          </Stack>
        );

      case 3:
        return (
          <Stack spacing={3}>
            <Typography variant="h6" gutterBottom>
              Account Security & Agreements
            </Typography>

            <Stack spacing={2}>
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
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
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

            {/* Agreements */}
            <Paper sx={{ p: 3, bgcolor: "grey.50" }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Legal Agreements
              </Typography>

              <Stack spacing={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="termsAccepted"
                      checked={formData.termsAccepted}
                      onChange={handleInputChange}
                    />
                  }
                  label={
                    <Typography variant="body2">
                      I accept the{" "}
                      <Link component="button" type="button">
                        Terms and Conditions
                      </Link>{" "}
                      *
                    </Typography>
                  }
                />
                {errors.termsAccepted && (
                  <Typography variant="caption" color="error" sx={{ ml: 4 }}>
                    {errors.termsAccepted}
                  </Typography>
                )}

                <FormControlLabel
                  control={
                    <Checkbox
                      name="privacyAccepted"
                      checked={formData.privacyAccepted}
                      onChange={handleInputChange}
                    />
                  }
                  label={
                    <Typography variant="body2">
                      I accept the{" "}
                      <Link component="button" type="button">
                        Privacy Policy
                      </Link>{" "}
                      *
                    </Typography>
                  }
                />
                {errors.privacyAccepted && (
                  <Typography variant="caption" color="error" sx={{ ml: 4 }}>
                    {errors.privacyAccepted}
                  </Typography>
                )}

                <FormControlLabel
                  control={
                    <Checkbox
                      name="communicationConsent"
                      checked={formData.communicationConsent}
                      onChange={handleInputChange}
                    />
                  }
                  label={
                    <Typography variant="body2" color="text.secondary">
                      I consent to receive appointment reminders and health
                      information via email and SMS
                    </Typography>
                  }
                />
              </Stack>
            </Paper>
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
                  Your patient account has been created successfully. You can
                  now log in to access your health portal.
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
          background: "linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)",
          py: 4,
        }}
      >
        <Container maxWidth="md">
          <Card sx={{ overflow: "hidden" }}>
            {/* Header */}
            <Paper sx={{ bgcolor: "primary.main", color: "white", p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                <Favorite sx={{ fontSize: 32, mr: 1 }} />
                <Typography variant="h4" component="h1" align="center">
                  Patient Registration
                </Typography>
              </Box>
              <Typography variant="body1" align="center" sx={{ opacity: 0.9 }}>
                Join our healthcare community
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
                    Previous
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
                      {isLoading ? "Registering..." : "Complete Registration"}
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

export default PatientRegistration;
