import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import SignIn from "./pages/SignsIn"
import SignUp from "./pages/SignUp"
import Home from "./pages/Home"
import History from "./pages/History"
import MapPage from "./pages/MapPage"
import Logout from "./pages/Logout"
import Navbar from "./components/Navbar"
import CssBaseline from "@mui/material/CssBaseline"

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#4CAF50", // Green
      light: "#81C784",
      dark: "#388E3C",
    },
    secondary: {
      main: "#212121", // Dark gray/black
    },
    background: {
      default: "#121212",
      paper: "#1E1E1E",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#B0B0B0",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
        },
        containedPrimary: {
          "&:hover": {
            backgroundColor: "#388E3C",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#121212",
          boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
        },
      },
    },
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Adds consistent baseline styles */}
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/home" element={<Home />} />
          <Route path="/history" element={<History />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
