import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useState } from "react";
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

function CreateAccountPage() {

    const navigate = useNavigate();
    let [username, setUsername] = useState<string>("");
    let [password, setPassword] = useState<string>("");
    const [messages, setMessages] = useState<string[]>([]);
    let [isHide, setIsHide] = useState<boolean>(true);
    let [isCreated, setIsCreated] = useState<boolean>(false);


    const handleClick = async () => {
        try {
            let formData = {
                username: username,
                password: password,
            }
            await axios.post("/api/createAccount", formData);
            setMessages(["Account successfully created"]);
            setIsCreated(true);
            //navigate("/");

        } catch (error) {
            
            setMessages(["Username already taken."]); 
            //setMessages(getAxiosErrorMessages(error));
            

        }

    };
    return (
        <>
            <h1>Create a New Account</h1>
            <FormControl>

                <TextField 
                    id="new-username" 
                    label="New Username" 
                    variant="outlined"
                    value={username}
                    style={{marginTop: "20px"}}
                    onChange={(e) => {
                        setUsername(e.target.value);
                        
                        
                    }}
                />
                
                <TextField 
                    id="new-password" 
                    label="New Password" 
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
                    startIcon={<EditIcon />}
                    onClick={handleClick}
                >
                    Create New Account
                </Button>

               

                
                
                
            </FormControl>

            <div className="error-message">
                <Paper variant="outlined" style={{marginTop: "20px"}}>
                    <List>
                        {messages.map((message, i) => (
                            <ListItem key={i}>
                                {message === "Account successfully created" ? <CheckCircleIcon style={{ color: 'green' }} /> : <WarningIcon color="error" />}
                                {message === "Account successfully created" ? <Typography color="green">{message}</Typography> : <Typography color="error">{message}</Typography>}
                            </ListItem>
                        ))}
                    </List>

                    
                </Paper>
                
                {isCreated && <Button
                        variant="contained" 
                        color="primary"
                        size="medium"
                        startIcon={<ArrowBackIcon />}
                        style={{marginTop: "20px"}}
                        onClick={() => navigate("/")}
                        >
                        Return to Login
                    </Button>}
            </div>

            
        </>
    );
}

export default CreateAccountPage;