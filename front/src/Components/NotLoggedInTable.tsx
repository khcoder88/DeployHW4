import { useState, useEffect } from "react";

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

function NotLoggedInTable() {

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

    useEffect(() => {
        (async () => {
            try {
                const response: AxiosResponse<{results: Book[]}>  = await axios.get<{results: Book[]}>("/api/book");
                
                const { results } = response.data;
                setBooks(results);
                
                
                const response2: AxiosResponse<{results: AuthorData[]}>  = await axios.get<{results: AuthorData[]}>("/api/author");
                
                const results2 = response2.data.results;
                setAuthorOptions(results2);

            } catch (error) {
                setMessages(getAxiosErrorMessages(error));
            }
        })();
    }, []);

    return (
        <>
            <h1>All Books</h1>
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
                                            
                                        </TableRow>
                                    )) 

                                    
                                    }
                            

                            
                        </TableBody>
                    </Table>
                    
            </TableContainer>
        
        </>
    );
}

export default NotLoggedInTable;