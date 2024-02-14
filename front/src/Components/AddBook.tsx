import { useEffect, useState } from "react";
import { getAxiosErrorMessages } from "./utils";
import axios, { AxiosError, AxiosResponse  } from "axios";
import "./AddBook.css";

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


interface AuthorData {
    id: number;
    name: string;
    bio?: string;
}



function AddBook() {


    let [authorID, setAuthorID] = useState<string>("");
    let [authorOptions, setAuthorOptions] = useState<AuthorData[]>([]);
    let [bookTitle, setBookTitle] = useState<string>("");
    let [pubYear, setPubYear] = useState<string>("");
    let [genre, setGenre] = useState<string>("");
    let [curUsername, setCurUsername] = useState<string>("");
    const [messages, setMessages] = useState<string[]>([]);

    useEffect(() => {
        (async () => {
            try {
                const response: AxiosResponse<{results: AuthorData[]}>  = await axios.get<{results: AuthorData[]}>("/api/author");
                //console.log(response);
                const { results } = response.data;
                setAuthorOptions(results);

                //get the username
                const response2: AxiosResponse<{results: string}> = await axios.get<{results: string}>(`/api/user`);
                setCurUsername(response2.data.results);


                

            } catch (error) {
                if (getAxiosErrorMessages(error)[0] === "Request failed with status code 401") {
                    setMessages(["Login is required to add/delete/edit data."]);
                }
                else {
                    setMessages(getAxiosErrorMessages(error));
                }
                
                //console.log(messages);
                //messages.push("Login is required to edit.");
                // if (err.response && err.response.data.status === 401) {
                //     console.log("inside")
                //     messages.push(err.data.error)
                // }
                
            }
        })();
    }, []);

    let handleSubmit = async function () {

        const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
        try {
       
            let errorMessages : string[] = [];
            if (!authorID)
            {
                errorMessages.push("Invalid author ID. Must select an author from the drop-down.");
            }

            if (!bookTitle || urlPattern.test(bookTitle))
            {
                errorMessages.push("Invalid book title. Minimum of 1 character. No URLs.");
            }
    
            if (/^\d{4}$/.test(pubYear) === false)
            {
                errorMessages.push("Invalid year. Must be a 4-digit year.");
            }

            if (!genre || urlPattern.test(genre))
            {
                errorMessages.push("Invalid genre. Minimum of 1 character. No URLs.");
            }

            if (errorMessages.length > 0)
            {
                setMessages(errorMessages);
            }
            else 
            {
                let data = {
                    author_id: parseInt(authorID, 10),
                    title: bookTitle,
                    pub_year: pubYear,
                    genre: genre,
                    username: curUsername,

                };
    
                await axios.post("/api/book", data);
    
                setMessages(["Book successfully added"]);
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
            <h2>Add a book</h2>
        


            <FormControl style={{marginTop: "20px"}} fullWidth>
            <InputLabel id="author-input-label">Select an Author</InputLabel>
            <Select
                labelId="author-input-label"
                id="author-id"
                value={authorID}
                label="Select an Author"
                onChange={(e) => {
                    setAuthorID(e.target.value);
                    setMessages([]);
                }}
            >
                <MenuItem value=""></MenuItem>
                {authorOptions.map(author => 
                    <MenuItem key={author.id} value={author.id}>{author.name}</MenuItem>
                )}
            </Select>
            


            <TextField 
                id="title-input-label" 
                label="Title" 
                variant="outlined"
                value={bookTitle}
                style={{marginTop: "20px"}}
                onChange={(e) => {
                    setBookTitle(e.target.value);
                    setMessages([]);
                }}
            />

            <TextField 
                id="year-inpt-label" 
                label="Publication Year" 
                variant="outlined"
                value={pubYear}
                style={{marginTop: "20px"}}
                onChange={(e) => {
                    setPubYear(e.target.value);
                    setMessages([]);
                    
                    
                }}
            />

            <TextField 
                id="genre-inpt-label" 
                label="Genre" 
                variant="outlined"
                value={genre}
                style={{marginTop: "20px"}}
                onChange={(e) => {
                    setGenre(e.target.value);
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
                Add Book
            </Button>
            
            <div className="error-message">
                <Paper variant="outlined" style={{marginTop: "20px"}}>
                    <List>
                        {messages.map((message, i) => (
                            <ListItem key={i}>
                                {message === "Book successfully added" ? <CheckCircleIcon style={{ color: 'green' }} /> : <WarningIcon color="error" />}
                                {message === "Book successfully added" ? <Typography color="green">{message}</Typography> : <Typography color="error">{message}</Typography>}
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            </div>
        </>
    );
}






export default AddBook;