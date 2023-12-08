import React, { useEffect, useState } from "react";
import "./Header.css";
import { Link, useNavigate } from "react-router-dom";
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import MovieIcon from '@mui/icons-material/Movie';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import PersonAddDisabledIcon from '@mui/icons-material/PersonAddDisabled';
import { Button, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import VideoCameraBackIcon from '@mui/icons-material/VideoCameraBack';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';


const RESTRICT_PATHS = [
    '/Login',
    '/Register',
    '/'
]

const Header = ({ pathVal }) => {
    const navigate = useNavigate();

    const [pathValue, setPathValue] = useState(pathVal);

    const [openSideNav, setOpenSideNav] = useState(false);

    const logoutUser = () => {
        localStorage.removeItem("userData");
        navigate('/')
    }
    const determineLogoLink = () => {
        if (userObject) {
          return '/moviehome';
        } else {
          return '/';
        }
      };

    const addMovie = () => {
        navigate('/addMovie')
    }
    const addActor = () => {
        navigate('/addActor')
    }
    const deleteActor = () => {
        navigate('/deleteActor')
    }
    const addGenre = () => {
        navigate('/addGenre')
    }
    const deleteGenre = () => {
        navigate('/deleteGenre')
    }
    const ViewWatchList=()=>{
        navigate('/watchList');
    }


    useEffect(() => {
        setPathValue(pathVal)
    }, [pathVal])

    console.log(pathValue, 'pathValuepathValue')

    const userObject = JSON.parse(localStorage.getItem("userData"));
    return (
        <div className="header">
            <div>
            {(userObject && !RESTRICT_PATHS.includes(pathValue)) && (
                <MenuIcon onClick={() => setOpenSideNav(true)} />
            )}
            <Drawer
                anchor="left"
                open={openSideNav}
                onClose={() => setOpenSideNav(false)}
        >
                <List>
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => logoutUser()}>
                            <ListItemIcon>
                                <LogoutIcon />
                            </ListItemIcon>
                            <ListItemText primary="Logout" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => ViewWatchList()}>
                            <ListItemIcon>
                                <FavoriteIcon />
                            </ListItemIcon>
                            <ListItemText primary="WatchList" />
                        </ListItemButton>
                    </ListItem>

                    {userObject?.userType === "producer" && (
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => addMovie()}>
                                <ListItemIcon>
                                    <MovieIcon />
                                </ListItemIcon>
                                <ListItemText primary="Add Movie" />
                            </ListItemButton>
                        </ListItem>
                    )}
                    
                    {userObject?.userType === "admin" && (
                        <>
                            <ListItem disablePadding>
                                <ListItemButton onClick={() => addMovie()}>
                                    <ListItemIcon>
                                        <MovieIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Add Movie" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton onClick={() => addActor()}>
                                    <ListItemIcon>
                                        <PersonAddAltIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Add Actor" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton onClick={() => deleteActor()}>
                                    <ListItemIcon>
                                        <PersonAddDisabledIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Delete Actor" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton onClick={() => addGenre()}>
                                    <ListItemIcon>
                                        <VideoCameraBackIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Add Genre" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton onClick={() => deleteGenre()}>
                                    <ListItemIcon>
                                        <DeleteIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Delete Genre" />
                                </ListItemButton>
                            </ListItem>
                        </>
                    )}
                </List>


            </Drawer>
            
            <Link to= {determineLogoLink()} className="header__logo">
                <img src={process.env.PUBLIC_URL + '/moviemate.png'} alt="MovieMate Logo" />
            </Link>
            </div>
            {(!userObject && (pathValue !== '/login' && pathValue !== '/register')) && (
                <div className="header-login-container">
                    <Button className="header-login-btns">
                        <Link to="/Register" className="header__link" style={{ textDecoration: "none" }}> <span>Register</span></Link>
                    </Button>
                    <Button>
                        <Link to="/Login" className="header__link" style={{ textDecoration: "none" }}><span>Login</span></Link>
                    </Button>
                </div>
            )}

        </div>
    );
}

export default Header;
