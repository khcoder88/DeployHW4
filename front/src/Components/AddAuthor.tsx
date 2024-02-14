import { useState } from "react";
import { getAxiosErrorMessages } from "./utils";
import axios, { AxiosError, AxiosResponse  } from "axios";
import "./AddAuthor.css";

import { TableContainer,TableHead, Table, TableRow, TableCell, TableBody } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import BookIcon from '@mui/icons-material/Book';
import { AccountCircle } from '@mui/icons-material';

// import { makeStyles } from '@mui/material/styles';
// import { Theme } from '@mui/material/styles';
import { TextField, Select, MenuItem, FormControl, InputLabel, Grid } from '@mui/material';


import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send'
import Box from '@mui/material/Box';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CategoryIcon from '@mui/icons-material/Category';
import EditIcon from '@mui/icons-material/Edit';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Paper, Typography, List, ListItem } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { createTheme } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function AddAuthor() {
    let [authorName, setAuthorName] = useState<string>("");
    let [bio, setBio] = useState<string>("");
    const [messages, setMessages] = useState<string[]>([]);

    let handleSubmit = async function () {
        try {
            const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
            let errorMessages: string[] = [];
            if (!authorName || urlPattern.test(authorName)) 
            {
                errorMessages.push("Invalid author name. Minimum of 1 character and  no URLs.")
            }

            if (urlPattern.test(bio)) {
                errorMessages.push("Invalid bio. No URLs.")
            }

            if (errorMessages.length > 0)
            {
                setMessages(errorMessages);
            }
            else 
            {
                let data = {
                    name: authorName,
                    bio: bio,
                };
    
                await axios.post("/api/author", data);
    
                setMessages(["Author successfully added"]);
            }
            
        } catch (error) {
            if (getAxiosErrorMessages(error)[0] === "Request failed with status code 401") {
                setMessages(["Login is required to add/delete/edit data."]);
            }
            else {
                setMessages(getAxiosErrorMessages(error));
            }
            
            
        }
    };
    
    return (
        <>
            <h2>Add an Author</h2>
            

            <FormControl style={{marginTop: "20px"}} fullWidth>
            
            


            <TextField 
                id="author-name-label" 
                label="Author Name" 
                variant="outlined"
                value={authorName}
                style={{marginTop: "20px"}}
                onChange={(e) => {
                    setAuthorName(e.target.value); 
                }}
            />

            <TextField 
                id="bio-label" 
                label="Bio (optional)" 
                variant="outlined"
                value={bio}
                multiline
                style={{marginTop: "20px"}}
                onChange={(e) => {
                    setBio(e.target.value);
                    setMessages([]);
                }}

            />

            


            

            </FormControl>
            
            <Button
                variant="contained" 
                color="primary"
                size="medium"
                style={{marginTop: "20px"}}
                startIcon={<AddIcon />}
                onClick={handleSubmit}
            >
                Add Author
            </Button>

            <div className="error-message">
                <Paper variant="outlined" style={{marginTop: "20px"}}>
                    <List>
                        {messages.map((message, i) => (
                            <ListItem key={i}>
                                {message === "Author successfully added" ? <CheckCircleIcon style={{ color: 'green' }} /> : <WarningIcon color="error" />}
                                {message === "Author successfully added" ? <Typography color="green">{message}</Typography> : <Typography color="error">{message}</Typography>}
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            </div>
        </>
    );
}






export default AddAuthor;
