"use client"

import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { Spa } from "@mui/icons-material"

function Navbar() {
  const navigate = useNavigate()
  const isAuthenticated = !!localStorage.getItem("token")

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/")
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <Spa sx={{ color: "#4CAF50", mr: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Paddy Disease Detection
          </Typography>
        </Box>
        {isAuthenticated ? (
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              color="primary"
              variant="text"
              onClick={() => navigate("/home")}
              sx={{ "&:hover": { backgroundColor: "rgba(76, 175, 80, 0.08)" } }}
            >
              Home
            </Button>
            <Button
              color="primary"
              variant="text"
              onClick={() => navigate("/history")}
              sx={{ "&:hover": { backgroundColor: "rgba(76, 175, 80, 0.08)" } }}
            >
              History
            </Button>
            <Button
              color="primary"
              variant="text"
              onClick={() => navigate("/map")}
              sx={{ "&:hover": { backgroundColor: "rgba(76, 175, 80, 0.08)" } }}
            >
              Map
            </Button>
            <Button color="primary" variant="contained" onClick={handleLogout} sx={{ ml: 1 }}>
              Logout
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              color="primary"
              variant="text"
              onClick={() => navigate("/")}
              sx={{ "&:hover": { backgroundColor: "rgba(76, 175, 80, 0.08)" } }}
            >
              Sign In
            </Button>
            <Button color="primary" variant="contained" onClick={() => navigate("/signup")}>
              Sign Up
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
