/*
 *   Copyright (c) 2022 
 *   All rights reserved.
 */
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Search from './Search';
import LogoutIcon from '@mui/icons-material/Logout';
import { firebaseService } from "./FirebaseService";

const DRAWER_WIDTH = 240;
const NAV_ITEMS = ['Home', 'About', 'Contact'];

export default function PrimarySearchAppBar({ window }) {

    const container = window !== undefined ? () => window().document.body : undefined;

    const [mobileOpen, setMobileOpen] = React.useState(false);

    const drawer = (

        <Box onClick={() => setMobileOpen(!mobileOpen)} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ my: 2 }}>
                Start page
            </Typography>
            <Divider />
            <List>
                {NAV_ITEMS.map((item) => (
                    <ListItem key={item} disablePadding>
                        <ListItemButton sx={{ textAlign: 'center' }}>
                            <ListItemText primary={item} />
                        </ListItemButton>
                    </ListItem>
                ))}
                <Divider />
                <ListItem key='logout' disablePadding>
                    <ListItemButton sx={{ textAlign: 'center' }} onClick={() => firebaseService.signOut()}>
                        <ListItemText primary='Logout' />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <>
            <AppBar component="nav">
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                    >
                        Start page
                    </Typography>
                    <Search />
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        {/* {NAV_ITEMS.map((item) => (
                            <Button key={item} sx={{ color: '#fff' }}>
                                {item}
                            </Button>
                        ))} */}
                        <IconButton size="large" edge="end" aria-label="Logout" onClick={() => firebaseService.signOut()} color="inherit">
                            <LogoutIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            <Box component="nav">
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={() => setMobileOpen(!mobileOpen)}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH }, }}
                >
                    {drawer}
                </Drawer>
            </Box>
        </>
    );
};