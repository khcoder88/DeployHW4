import { useState, useEffect, useRef } from "react";

import { getAxiosErrorMessages, Book } from "./utils.ts";
import axios, { AxiosResponse } from "axios";
import { Link } from 'react-router-dom';
import "./BookTable.css";
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
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { MessageResponse } from "./types";

interface AuthorData {
    id: number;
    name: string;
    bio?: string;
}

function BookTable() {
    const [books, setBooks] = useState<Book[]>([]);
    const [messages, setMessages] = useState<string[]>([]);
    //let [authorFilter, setAuthorFilter] = useState<string>("");
    let [authorOptions, setAuthorOptions] = useState<AuthorData[]>([]);
    let [authorID, setAuthorID] = useState<string>("");
    let [pubYear, setPubYear] = useState<string>("");
    let [genre, setGenre] = useState<string>("");
    let [editMode, setEditMode] = useState<boolean>(false);
    let [whichBook, setWhichBook] = useState<string>("");
    let [whichAuthor, setWhichAuthor] = useState<string>("");
    let [whichPubYear, setWhichPubYear] = useState<string>("");
    let [whichGenre, setWhichGenre] = useState<string>("");

    let [editAuthor, setEditAuthor] = useState<number | string>();
    let [editTitle, setEditTitle] = useState<string>("");
    let [editPubYear, setEditPubYear] = useState<string>("");
    let [editGenre, setEditGenre] = useState<string>("");
    let [editBookId, setBookId] = useState<number>();

    let [dataIsUpToDate, setDataIsUpToDate] = useState<boolean>(true);
    let [curUsername, setCurUsername] = useState<string>("");

    //const editMenuRef = useRef();
   


    //let [isFilter, setIsFilter] = useState<boolean>(false);


    useEffect(() => {
        (async () => {
            try {
                

                // let isLoggedInRes = await axios<MessageResponse>({
                //     method: "post",
                //     url: "/api/checkLoggedIn",
                // })

                const response: AxiosResponse<{results: Book[]}>  = await axios.get<{results: Book[]}>("/api/book");
                    
                const { results } = response.data;
                setBooks(results);
                
                
                const response2: AxiosResponse<{results: AuthorData[]}>  = await axios.get<{results: AuthorData[]}>("/api/author");
                
                const results2 = response2.data.results;
                setAuthorOptions(results2);

                const response3: AxiosResponse<{results: string}> = await axios.get<{results: string}>(`/api/user`);
                setCurUsername(response3.data.results);
                // if (isLoggedInRes.status === 200) {
                //     const response: AxiosResponse<{results: Book[]}>  = await axios.get<{results: Book[]}>("/api/book");
                    
                //     const { results } = response.data;
                //     setBooks(results);
                    
                    
                //     const response2: AxiosResponse<{results: AuthorData[]}>  = await axios.get<{results: AuthorData[]}>("/api/author");
                    
                //     const results2 = response2.data.results;
                //     setAuthorOptions(results2);
                // }

            } catch (error) {
                if (getAxiosErrorMessages(error)[0] === "Request failed with status code 401") {
                    setMessages(["Login is required to add/delete/edit data."]);
                }
                else {
                    setMessages(getAxiosErrorMessages(error));
                }
            }
        })();
    }, []);

    
     

    
    
    return (
        <>
            <h1>Books</h1>
            
            
            <Grid container spacing={3} style={{marginTop: "20px"}}>
                <Grid item xs={4}>
                    <FormControl fullWidth>
                    <InputLabel id="author-label">Filter by Author:</InputLabel>
                    <Select
                        labelId="author-label"
                        id="author"
                        label="Filter by Author"
                        value={authorID}
                        onChange={(e) => {
                        setAuthorID(e.target.value);
                        setMessages([]);
                        }}
                    >
                        <MenuItem value="">None</MenuItem>
                        {authorOptions.map(author => (
                        <MenuItem key={author.id} value={author.id}>{author.name}</MenuItem>
                        ))}
                    </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={4}>
                    <FormControl fullWidth>
                    <InputLabel id="year-label"></InputLabel>
                    <TextField
                        id="pub_year"
                        type="text"
                        name="pub_year"
                        value={pubYear}
                        onChange={(e) => {
                        setPubYear(e.target.value);
                        setMessages([]);
                        }}
                        variant="outlined"
                        label="Filter by Publication Year:"
                        fullWidth
                    />
                    </FormControl>
                </Grid>
                <Grid item xs={4}>
                    <FormControl fullWidth>
                        <InputLabel id="genre-label"></InputLabel>
                        <TextField
                            id="genre-label"
                            type="text"
                            name="genre-label"
                            value={genre}
                            onChange={(e) => {
                                setGenre(e.target.value);
                                setMessages([]);
                                
                                
                            }}
                            variant="outlined"
                            label="Filter by Genre:"
                            fullWidth
                        />
                    </FormControl>
                
                </Grid>
            </Grid>

            <Button 
                variant="contained" 
                color="primary"
                size="medium"
                startIcon={<RefreshIcon />}
                style={{marginTop: "20px", marginBottom: "20px"}}
                >
                    <Link to="/edit" style={{ color: 'white', textDecoration: 'none' }}>
                    Refresh Table
                    </Link>
                    
            </Button>

            <div className="error-message">
                <Paper variant="outlined" style={{marginBottom: "35px"}}>
                    <List>
                        {messages.map((message, i) => (
                            <ListItem key={i}>
                                {message === "Book successfully edited. Refresh table." || message === "Book successfully deleted. Refresh table." ? <CheckCircleIcon style={{ color: 'green' }} /> : <WarningIcon color="error" />}
                                {message === "Book successfully edited. Refresh table." || message === "Book successfully deleted. Refresh table." ? <Typography color="green">{message}</Typography> : <Typography color="error">{message}</Typography>}
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            </div>
        
            {editMode && 
                <div>
                <Paper variant="outlined">
                <Typography variant="h4" gutterBottom>
                    Edit the Selected Book
                </Typography>
                <Button onClick={() => setEditMode(false)}>

                    <CloseIcon />
                    Close
                </Button>

                    <Grid container direction="column" spacing={3} style={{marginTop: "1px"}}>
                <Grid item xs={4}>
                    <FormControl fullWidth>
                    <InputLabel id="author-label"></InputLabel>
                    <Select
                        labelId="author-label"
                        value={editAuthor}
                            onChange={(e) => {
                            console.log(e.target.value);
                            setEditAuthor(e.target.value);
                                    
                       }}
                    >
                        <MenuItem value={editAuthor}>None</MenuItem>
                        {authorOptions.map(author => (
                        <MenuItem key={author.id} value={author.id}>{author.name}</MenuItem>
                        ))}
                    </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={4}>
                    <FormControl fullWidth>
                    <InputLabel id="title"></InputLabel>
                    <TextField
                        id="title"
                        type="text"
                        name="title"
                        value={editTitle}
                        onChange={(e) => {
                        setEditTitle(e.target.value);
                        
                        }}
                        variant="outlined"
                        label="Edit Title"
                        fullWidth
                    />
                    </FormControl>
                </Grid>
                <Grid item xs={4}>
                    <FormControl fullWidth>
                    <InputLabel id="pub_year"></InputLabel>
                    <TextField
                        id="pub_year"
                        type="text"
                        name="pub_year"
                        value={editPubYear}
                        onChange={(e) => {
                        setEditPubYear(e.target.value);
                        
                        }}
                        variant="outlined"
                        label="Edit Publication Year"
                        fullWidth
                    />
                    </FormControl>
                </Grid>
                <Grid item xs={4}>
                    <FormControl fullWidth>
                        <InputLabel id="genre-label"></InputLabel>
                        <TextField
                            id="genre-label"
                            type="text"
                            name="genre-label"
                            value={editGenre}
                            onChange={(e) => {
                                setEditGenre(e.target.value);
                            
                                
                                
                            }}
                            variant="outlined"
                            label="Edit Genre"
                            fullWidth
                        />
                    </FormControl>
                
                </Grid>
            </Grid>
            <Box marginTop={2}>
                <ButtonGroup style={{ display: 'flex', gap: '50px', marginBottom: "20px" }}>
                    <Button 
                        variant="contained" 
                        color="primary"
                        size="medium"
                        startIcon={<SendIcon />}
                        onClick={ async () => {
                            try {

                                
                                //console.log(editAuthor, editTitle, editPubYear, editGenre);
                                let errorMessages : string[] = [];
                                if (!editAuthor)
                                {
                                    errorMessages.push("Must select an author to complete edit.");
                                }

                                if (!editTitle)
                                {
                                    errorMessages.push("Invalid book title. Minimum of 1 character.");
                                }
                        
                                if (/^\d{4}$/.test(editPubYear) === false)
                                {
                                    errorMessages.push("Invalid year. Must be a 4-digit year.");
                                }

                                if (!editGenre)
                                {
                                    errorMessages.push("Invalid genre. Minimum of 1 character.");
                                }

                                if (errorMessages.length > 0)
                                {
                                    setMessages(errorMessages);
                                }

                    
                                else 
                                {
                                    //console.log(editTitle);
                                    let data = {
                                        author_id: editAuthor,
                                        title: editTitle,
                                        pub_year: editPubYear,
                                        genre: editGenre,
                                    };
                        
                                    await axios.put(`/api/book?id=${editBookId}`, data);
                        
                                    setMessages(["Book successfully edited. Refresh table."]);
                                    setEditMode(false);
                                    //window.location.reload();
                                    
                                    

                                    //const row = document.getElementById(`book-id-${editBookId}`);

                                }
                            }
                            catch (error) {
                                setMessages(getAxiosErrorMessages(error));
                            }
                        }}
                        >
                            Submit
                    </Button>
                    <Button 
                    variant="contained" 
                    color="primary"
                    size="medium"
                    startIcon={<DeleteIcon />}
                    onClick={async () => {
                        try {
                            //console.log("editBookId: ", editBookId);
                            await axios.delete(`/api/book?id=${editBookId}`);
                            setMessages(["Book successfully deleted. Refresh table."]);
                            setEditMode(false);
                        } catch (error) {
                            setMessages(getAxiosErrorMessages(error));
                        }
                    }}
                    >
                        Delete Book Entry
                    </Button>

                    
                </ButtonGroup>
            </Box>
            </Paper>
                </div>
            }

            

         {//start of  new code
         }
            <TableContainer style={{ marginBottom: "35px", marginTop: "20px"}}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow style={{ backgroundColor: "#CF9FFF"}}>
                                {
                                    [
                                        {heading: "ID", icon: <AccountCircle style={{ verticalAlign: "middle", marginRight: "8px" }} />}, 
                                        {heading: "Author", icon: <PersonIcon style={{ verticalAlign: "middle", marginRight: "8px" }}/>}, 
                                        {heading: "Title", icon: <BookIcon style={{ verticalAlign: "middle", marginRight: "8px" }}/>}, 
                                        {heading: "Publication Year", icon: <ScheduleIcon style={{ verticalAlign: 'middle', marginRight: "8px" }}/>}, 
                                        {heading: "Genre", icon: <CategoryIcon style={{ verticalAlign: "middle", marginRight: "8px" }}/>},
                                        {heading: "", icon: ""}
                                    ].map(
                                        cellInfo => <TableCell key={`${cellInfo.heading}-th`} style={{textAlign: "center"}}>{cellInfo.heading}{cellInfo.icon}</TableCell>
                                    )
                                }
                            </TableRow>
                            
                        </TableHead>
                        <TableBody>
                        {books.filter(book => 
                                    ((!authorID || book.author_id === parseInt(authorID, 10)) 
                                        && (!pubYear || book.pub_year === pubYear)
                                        && (!genre || book.genre === genre))
                                    ).map(book => (
                                        <TableRow key={book.id} className={`book-id-${book.id}`}>
                                            <TableCell style={{border: "1px solid black", textAlign: "center"}}>{book.id}</TableCell>
                                            <TableCell style={{border: "1px solid black", textAlign: "center"}}>{authorOptions.find(author => author.id === book.author_id)?.name || ''}</TableCell>
                                            <TableCell style={{border: "1px solid black", textAlign: "center"}}>{book.title}</TableCell>
                                            <TableCell style={{border: "1px solid black", textAlign: "center"}}>{book.pub_year}</TableCell>
                                            <TableCell style={{border: "1px solid black", textAlign: "center"}}>{book.genre}</TableCell>
                                            <TableCell style={{border: "1px solid black", textAlign: "center"}}>
                                            
                                            {book.username === curUsername && <Button 
                                            key={book.id} 
                                            startIcon={<EditIcon />}
                                            onClick={() => {
                                                setEditMode(!editMode);
                                                setBookId(book.id);
                                                setEditAuthor((authorOptions.find(author => author.id === book.author_id) || { id: 0, name: "", bio: "" }).id);
                                                setEditTitle(book.title);
                                                setEditPubYear(book.pub_year);
                                                setEditGenre(book.genre);
                                                setDataIsUpToDate(false);
                                                //editMenuRef.current.focus();
                                                //document.body.scrollIntoView({ behavior: "smooth", block: "end" });
                                            }}
                                            >

                                                Edit

                                                
                                            </Button>}
                                            </TableCell>
                                        </TableRow>
                                    )) 

                                    
                                    }
                            

                            
                        </TableBody>
                    </Table>
                    
            </TableContainer>

            <div className="error-message">
                <Paper variant="outlined" style={{marginBottom: "35px"}}>
                    <List>
                        {messages.map((message, i) => (
                            <ListItem key={i}>
                                {message === "Book successfully edited. Refresh table." || message === "Book successfully deleted. Refresh table." ? <CheckCircleIcon style={{ color: 'green' }} /> : <WarningIcon color="error" />}
                                {message === "Book successfully edited. Refresh table." || message === "Book successfully deleted. Refresh table." ? <Typography color="green">{message}</Typography> : <Typography color="error">{message}</Typography>}
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            </div>
            
            
            
           

            
            
            
                
           

            

            

        </>
    );
}

export default BookTable;


