import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import SendIcon from '@mui/icons-material/Send';
import EditIcon from '@mui/icons-material/Edit'
import { getAxiosErrorMessages } from "./utils";
import axios, { AxiosError, AxiosResponse  } from "axios";
import { Paper, Typography, List, ListItem } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import LockOpenIcon from '@mui/icons-material/LockOpen';

import React, { FC, useState } from "react";

import { MessageResponse } from "./types.tsx";

import NotLoggedInTable from "./NotLoggedInTable";

function LoginPage() {

    const navigate = useNavigate();
    let [username, setUsername] = useState<string>("");
    let [password, setPassword] = useState<string>("");
    const [messages, setMessages] = useState<string[]>([]);
    let [isHide, setIsHide] = useState<boolean>(true);
    let [isCreated, setIsCreated] = useState<boolean>(false);

    // const handleClick = async () => {
    //     try {
    //         let formData = {
    //             username: username,
    //             password: password,
    //         }
    //         await axios.post("/api/createAccount", formData);
    //         setMessages(["Account successfully created"]);
    //         setIsCreated(true);

    //     } catch (error) {
    //         setMessages(getAxiosErrorMessages(error));
    //     }


    let handleClick = async (event: React.SyntheticEvent) => {
        event.preventDefault();
        let formData = {
            username: username,
            password: password,
        }
        //console.log(formData);
        try {
            let {
                status,
                data: { message },
            } = await axios<MessageResponse>({
                method: "post",
                url: "/api/login",
                data: formData,
            });

            if (status !== 200) {
                setMessages(["Username and/or password is invalid"]);
                return;
            }
            //console.log("Success");
            navigate("/table");
            //setIsLoggedIn(true);
        } catch (error) {
            console.log(error);
            setMessages(["Username and/or password is invalid. Please try again."]);
            return;
        }
    };



    return (
        <>
            <h1>Login Here</h1>
            <FormControl>

                <TextField 
                    id="username" 
                    label="Username" 
                    variant="outlined"
                    value={username}
                    style={{marginTop: "20px"}}
                    onChange={(e) => {
                        setUsername(e.target.value);
                        
                        
                    }}
                />

                <TextField 
                    id="password" 
                    label="Password" 
                    variant="outlined"
                    value={password}
                    type={isHide ? "password" : "text"}
                    style={{marginTop: "20px"}}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        
                        
                    }}

                    
                />

                <br></br>
                <Button
                    variant="contained" 
                    color="primary"
                    size="medium"
                    startIcon={isHide ? <VisibilityIcon /> : <VisibilityOffIcon/>}
                    onClick={() => setIsHide(!isHide)}
                >
                    Show Password
                </Button>

                <br></br>

                <Button
                    variant="contained" 
                    color="primary"
                    size="medium"
                    startIcon={<CheckCircleIcon />}
                    onClick={handleClick}
                >
                    Login
                </Button>

                <br></br>

                <Button
                    variant="contained" 
                    color="primary"
                    size="medium"
                    startIcon={<EditIcon />}
                    onClick={() => {navigate("/createAccount")}}
                >
                    Create New Account
                </Button>








            </FormControl>

            <div className="error-message">
                <Paper variant="outlined" style={{marginTop: "20px"}}>
                    <List>
                        {messages.map((message, i) => (
                            <ListItem key={i}>
                                <WarningIcon color="error" />
                                <Typography color="error">{message}</Typography>
                            </ListItem>
                        ))}
                    </List>

                    
                </Paper>
                
            </div>

            


        </>
    );
}

export default LoginPage;