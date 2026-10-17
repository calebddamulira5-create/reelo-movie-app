import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from './Navbar';
import SideNav from './SideNav';
import Footer from './Footer';
import { NAV_WIDTH } from '../config';

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  // Start every new page at the top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Navbar onMenuClick={() => setMenuOpen(true)} />
      <SideNav open={menuOpen} onClose={() => setMenuOpen(false)} />
      <Box sx={{ ml: { md: `${NAV_WIDTH}px` }, minWidth: 0, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Box component="main" sx={{ flex: 1, minWidth: 0 }}>
          <Outlet />
        </Box>
        <Footer />
      </Box>
    </Box>
  );
}
