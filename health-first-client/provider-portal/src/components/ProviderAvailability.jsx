import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  Paper,
  Grid,
  Stack,
  Container,
  IconButton,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  CalendarToday,
  Schedule,
  LocationOn,
  AttachMoney,
  NavigateBefore,
  NavigateNext,
  Today,
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
  },
});

const ProviderAvailability = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("month"); // month, week, day
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availabilities, setAvailabilities] = useState([
    {
      id: 1,
      date: "2024-01-15",
      startTime: "09:00",
      endTime: "17:00",
      locationType: "clinic",
      appointmentType: "consultation",
      baseFee: "150",
      currency: "USD",
      notes: "General consultation hours",
    },
    {
      id: 2,
      date: "2024-01-16",
      startTime: "10:00",
      endTime: "16:00",
      locationType: "telemedicine",
      appointmentType: "telemedicine",
      baseFee: "100",
      currency: "USD",
      notes: "Online consultations",
    },
  ]);

  const appointmentTypes = [
    { value: "consultation", label: "Consultation" },
    { value: "follow_up", label: "Follow-up" },
    { value: "emergency", label: "Emergency" },
    { value: "telemedicine", label: "Telemedicine" },
  ];

  const locationTypes = [
    { value: "clinic", label: "Clinic" },
    { value: "hospital", label: "Hospital" },
    { value: "telemedicine", label: "Telemedicine" },
    { value: "home_visit", label: "Home Visit" },
  ];

  const getMonthName = (date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const handleDateClick = (day) => {
    if (day) {
      const clickedDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      setSelectedDate(clickedDate);
      setModalOpen(true);
    }
  };

  const handleAddAvailability = () => {
    setModalOpen(true);
  };

  const handleEdit = (availability) => {
    // Edit functionality would be implemented here
    console.log("Edit availability:", availability);
  };

  const handleDelete = (id) => {
    setAvailabilities(availabilities.filter((av) => av.id !== id));
  };

  const renderCalendarView = () => {
    const days = getDaysInMonth(currentDate);
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
      <Card>
        <CardContent>
          {/* Calendar Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h6">{getMonthName(currentDate)}</Typography>
            <Box>
              <IconButton onClick={() => navigateMonth(-1)}>
                <NavigateBefore />
              </IconButton>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setCurrentDate(new Date())}
                sx={{ mx: 1 }}
              >
                Today
              </Button>
              <IconButton onClick={() => navigateMonth(1)}>
                <NavigateNext />
              </IconButton>
            </Box>
          </Box>

          {/* Week days header */}
          <Grid container spacing={1} sx={{ mb: 1 }}>
            {weekDays.map((day) => (
              <Grid item xs key={day}>
                <Typography
                  variant="body2"
                  align="center"
                  fontWeight={600}
                  color="text.secondary"
                >
                  {day}
                </Typography>
              </Grid>
            ))}
          </Grid>

          {/* Calendar days */}
          <Grid container spacing={1}>
            {days.map((day, index) => (
              <Grid item xs key={index}>
                <Paper
                  sx={{
                    height: 60,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: day ? "pointer" : "default",
                    bgcolor: day ? "white" : "grey.50",
                    "&:hover": {
                      bgcolor: day ? "primary.50" : "grey.50",
                    },
                  }}
                  onClick={() => handleDateClick(day)}
                  elevation={day ? 1 : 0}
                >
                  {day && (
                    <Typography variant="body2" fontWeight={500}>
                      {day}
                    </Typography>
                  )}
                </Paper>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    );
  };

  const renderAvailabilityList = () => {
    return (
      <Card>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h6">Current Availabilities</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddAvailability}
            >
              Add Availability
            </Button>
          </Box>

          {availabilities.length === 0 ? (
            <Alert severity="info">
              No availabilities set. Click "Add Availability" to get started.
            </Alert>
          ) : (
            <List>
              {availabilities.map((availability) => (
                <ListItem
                  key={availability.id}
                  sx={{
                    border: 1,
                    borderColor: "grey.200",
                    borderRadius: 2,
                    mb: 1,
                    bgcolor: "grey.50",
                  }}
                >
                  <ListItemText
                    primary={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <Typography variant="subtitle2">
                          {new Date(availability.date).toLocaleDateString()}
                        </Typography>
                        <Chip
                          size="small"
                          label={availability.appointmentType}
                          color={
                            availability.appointmentType === "emergency"
                              ? "error"
                              : availability.appointmentType === "telemedicine"
                              ? "success"
                              : "primary"
                          }
                        />
                      </Box>
                    }
                    secondary={
                      <Stack spacing={0.5}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <Schedule sx={{ fontSize: 16 }} />
                          <Typography variant="body2">
                            {availability.startTime} - {availability.endTime}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <LocationOn sx={{ fontSize: 16 }} />
                          <Typography variant="body2">
                            {availability.locationType}
                          </Typography>
                        </Box>
                        {availability.baseFee && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <AttachMoney sx={{ fontSize: 16 }} />
                            <Typography variant="body2">
                              {availability.currency} {availability.baseFee}
                            </Typography>
                          </Box>
                        )}
                      </Stack>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => handleEdit(availability)}
                      sx={{ mr: 1 }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      edge="end"
                      onClick={() => handleDelete(availability.id)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderAvailabilityModal = () => {
    return (
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6">Add Availability</Typography>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  defaultValue={
                    selectedDate ? selectedDate.toISOString().split("T")[0] : ""
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Appointment Type</InputLabel>
                  <Select defaultValue="consultation" label="Appointment Type">
                    {appointmentTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Start Time"
                  type="time"
                  InputLabelProps={{ shrink: true }}
                  defaultValue="09:00"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="End Time"
                  type="time"
                  InputLabelProps={{ shrink: true }}
                  defaultValue="17:00"
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Location Type</InputLabel>
                  <Select defaultValue="clinic" label="Location Type">
                    {locationTypes.map((location) => (
                      <MenuItem key={location.value} value={location.value}>
                        {location.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Base Fee"
                  type="number"
                  placeholder="150"
                  InputProps={{
                    startAdornment: "$",
                  }}
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth
              label="Notes"
              multiline
              rows={3}
              placeholder="Additional notes about this availability..."
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setModalOpen(false)}>
            Save Availability
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 3 }}>
        <Container maxWidth="xl">
          {/* Header */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography variant="h4" gutterBottom>
                  Provider Availability Management
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Manage your appointment availability and scheduling
                </Typography>
              </Box>

              <Stack direction="row" spacing={1}>
                <Button
                  variant={view === "month" ? "contained" : "outlined"}
                  onClick={() => setView("month")}
                  startIcon={<CalendarToday />}
                >
                  Month
                </Button>
                <Button
                  variant={view === "week" ? "contained" : "outlined"}
                  onClick={() => setView("week")}
                  startIcon={<Schedule />}
                >
                  Week
                </Button>
              </Stack>
            </Box>
          </Paper>

          {/* Main Content */}
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              {renderCalendarView()}
            </Grid>
            <Grid item xs={12} lg={4}>
              {renderAvailabilityList()}
            </Grid>
          </Grid>

          {/* Floating Action Button */}
          <Fab
            color="primary"
            sx={{ position: "fixed", bottom: 24, right: 24 }}
            onClick={handleAddAvailability}
          >
            <Add />
          </Fab>

          {/* Availability Modal */}
          {renderAvailabilityModal()}
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default ProviderAvailability;
