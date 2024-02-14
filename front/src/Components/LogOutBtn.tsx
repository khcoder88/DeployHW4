import Button from '@mui/material/Button';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import React, { FC, useState } from "react";
import axios from "axios";
import { MessageResponse } from "./types";
import { useNavigate } from 'react-router-dom';



let LogOutBtn = () =>  {
    const navigate = useNavigate();

    const handleClick = async () => {
        await axios<MessageResponse>({
            method: "post",
            url: "/api/logout",
        });
        //setIsLoggedInFromLayout(false);
        navigate("/")


    };

    return (
        <>
            <Button variant="contained" 
                color="primary"
                size="medium"
                startIcon={<ExitToAppIcon />}
                style={{marginTop: "20px", marginBottom: "20px"}}
                onClick={handleClick}
            >
                Log Out
            </Button>
        </>
    );
}

export default LogOutBtn;