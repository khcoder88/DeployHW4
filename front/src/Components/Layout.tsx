// import React from "react";
import { Link, Outlet } from "react-router-dom";
import "./Layout.css";
// import "./Layout.css";
import LogOutBtn from "./LogOutBtn";
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import HomeIcon from '@mui/icons-material/Home';
import LockOpenIcon from '@mui/icons-material/LockOpen';

function Header() {
    return (
        <>
            <Link to="/">
                <Button
                    variant="contained" 
                    color="primary"
                    size="medium"
                    startIcon={<LockOpenIcon />}
                    style={{marginTop: "20px", marginBottom: "20px"}}
                >
                    LOG IN
                </Button>
                
            </Link>

            <Link to="/table">
                <Button
                    variant="contained" 
                    color="primary"
                    size="medium"
                    startIcon={<HomeIcon />}
                    style={{marginTop: "20px", marginBottom: "20px"}}
                >
                    Home
                </Button>
                
            </Link>
            <Link to="/addAuthor">
                <Button
                    variant="contained" 
                    color="primary"
                    size="medium"
                    startIcon={<AddIcon />}
                    style={{marginTop: "20px", marginBottom: "20px"}}
                >
                    Add Author
                </Button>
                
            </Link>
            <Link to="/addBook">
                
                <Button
                    variant="contained" 
                    color="primary"
                    size="medium"
                    startIcon={<AddIcon />}
                    style={{marginTop: "20px", marginBottom: "20px"}}
                >
                    Add Book
                </Button>
            </Link>
            <LogOutBtn />
            
            
            


        </>
    );
}

function Layout() {
    return (
        <>
            <nav>
                <Header />
            </nav>
            <main>
                <Outlet />
            </main>
        </>
    );
}

export default Layout;
