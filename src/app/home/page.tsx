import React from 'react';
import { Box, AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Link from 'next/link';  

const Page = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Top Header with Gradient Background */}
      <AppBar
        position="static"
        sx={{
          background: 'linear-gradient(to right, #1976d2, #FFEB3B)',  // Blue to Yellow gradient
          color: 'white',  // White text
          fontFamily: "'Roboto', sans-serif",  // Set a nice font from Google Fonts
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          {/* Title centered */}
          <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 'bold', flexGrow: 1 }}>
            R' Pool
          </Typography>

          {/* Profile Icon linked to the account page with padding around it */}
          <Link href="/account" passHref>
            <IconButton 
              sx={{ 
                color: 'white', 
                padding: '8px', 
                marginRight: '30px'  
              }} 
              aria-label="account"
            >
              <AccountCircleIcon />
            </IconButton>
          </Link>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {/* This section is blank for now */}
      </Box>
    </Box>
  );
}

export default Page;
