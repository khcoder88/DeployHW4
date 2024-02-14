import express, {
    Request,
    Response,
    RequestHandler,
    CookieOptions,
} from "express";
import { rateLimit } from 'express-rate-limit';
import RateLimitOptions from 'express-rate-limit';
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import * as url from "url";
import { z } from "zod";
import helmet from "helmet";



import * as argon2 from "argon2";
import crypto from "crypto";

import * as sqlite from "sqlite";


import cookieParser from "cookie-parser";
import { EmptyResponse, MessageResponse } from "./types.js";
import path from "path";

let app = express();
app.use(cookieParser());
app.use(express.json());
app.use(helmet());

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 300, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Use an external store for consistency across multiple server instances.
})

// Apply the rate limiting middleware to all requests.
app.use(limiter)

// create database "connection"
// use absolute path to avoid this issue
// https://github.com/TryGhost/node-sqlite3/issues/441
let __dirname = url.fileURLToPath(new URL("..", import.meta.url));
let dbfile = `${__dirname}database.db`;
let db = await open({
    filename: dbfile,
    driver: sqlite3.Database,
});
await db.get("PRAGMA foreign_keys = ON");

let loginSchema = z.object({
    username: z.string().min(1),
    password: z.string().min(1),
});

let tokenStorage: { [key: string]: string } = {};

let cookieOptions: CookieOptions = {
    httpOnly: true, // don't allow JS to touch cookies
    secure: true, // only send cookies over HTTPS
    sameSite: "strict", // https://web.dev/articles/samesite-cookies-explained
};

function makeToken() {
    return crypto.randomBytes(32).toString("hex");
}

// data entries

async function login(req: Request, res: Response<MessageResponse>) {
    let parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
        return res
            .status(400)
            .json({ message: "Username or password invalid" });
    }
    let { username, password } = parseResult.data;

    // TODO
    // get user's password from DB
    // if username didn't exist, handle error
    // else, hash plaintext password from body, compare w/ DB password
    // if no match, 400 response
    // if match, create token, store in tokenStorage, set cookie

	//console.log(`Logging in ... username: ${username} and password: ${password}`);
    try
    {
        // get user's password from DB
        let actualPassword = await db.get(
            'SELECT password FROM users WHERE username = ?', 
            [username]);
		//console.log(`hashed password: ${actualPassword}`);
        // if username didn't exist, handle error
        if (!actualPassword) {
            return res.status(400).json({ message: "Username not found." });
        }

        // else, hash plaintext password from body, compare w/ DB password
        let isValidPassword = await argon2.verify(actualPassword.password, password);

        //if no match, 400 response
        if (!isValidPassword) {
            return res.status(400).json({ message: "Incorrect password." });
        }
		//console.log(`before token`);
        // if match, create token, store in tokenStorage, set cookie
        let token = makeToken();
		//console.log(token);
        tokenStorage[token] = username;
		
        return res
            .cookie("token", token, cookieOptions)
            .json({ message: "Login successful." });



    }
    catch (err)
    {
        let error = err as Object;
		return res.status(500).json({ message: error.toString() });


    }
    


    // return res.json();
    // // return res
    // //     .cookie("token", token, cookieOptions)
    // //     .json();
}

async function logout(req: Request, res: Response<EmptyResponse>) {
    // // TODO
    // // if logged in and token valid, remove token from tokenStorage, clear cookie
    // return res.send();
    // // return res.clearCookie("token", cookieOptions).send();

    try {
        // if logged in and token valid
        let token = req.cookies.token;
        if (!token || !tokenStorage[token]) 
        {
            return res.status(401).json();
        }

        // remove token from tokenStorage
        delete tokenStorage[token];

        // clear cookie
        return res
            .clearCookie("token", cookieOptions)
            .send();


    } 
    catch (err) 
    {
        const error = err as Object;
        return res.status(500).json();
    }
}

let authorize: RequestHandler = (req, res, next) => {
    let { token } = req.cookies;
    if (token === undefined || !tokenStorage.hasOwnProperty(token)) {
        return res.status(403).json({ message: "Unauthorized" });
    }
    next();
};

function publicAPI(req: Request, res: Response<MessageResponse>) {
    return res.json({ message: "A public message" });
}
function privateAPI(req: Request, res: Response<MessageResponse>) {
    return res.json({ message: "A private message" });
}

async function checkLoggedIn(req: Request, res: Response<MessageResponse>) {
	try {
        // Check if the token exists in the request cookies
        let token = req.cookies.token;

        // If the token does not exist, the user is not logged in
        if (!token) {
            return res.status(401).json({ message: "Unauthorized - User is not logged in." });
        }

        // Check if the token is valid (e.g., verify against token storage)
        let username = tokenStorage[token]; // Assuming tokenStorage contains valid tokens
        if (!username) {
            return res.status(401).json({ message: "Unauthorized - Invalid token." });
        }

        // If the token is valid, the user is logged in
        return res.status(200).json({ message: "User is logged in." });
    } catch (err) {
		const error = err as Object;
        return res.status(500).json({ message: error.toString() });
    }
}

async function createAccount(req: Request, res: Response<MessageResponse>) {
	let hashedPassword;
	let parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
        return res
            .status(400)
            .json({ message: "Username or password invalid" });
    }
    let { username, password } = parseResult.data;

	try {
		let actualPassword = await db.get(
            'SELECT password FROM users WHERE username = ?', 
            [username]);
		
		
		if (!actualPassword) {
			// argon2.hash(password)
			// .then(h => { 
				
				
			// })
			let hashedPassword = await argon2.hash(password);
			//console.log(hashedPassword);

			let response = await db.run(
				"INSERT INTO users(username, password) VALUES(?, ?)",
				[username, hashedPassword]
			);
			return res.status(201).json({ message: "Account created." });
		}
		//console.log("I passed the if-block");

		return res.status(400).json({message: "Username taken."});

	} catch (err) {
		const error = err as Object;
        return res.status(500).json({ message: error.toString() });
	}
}


app.post("/api/login", login);
app.post("/api/logout", logout);
app.post("/api/createAccount", createAccount);
app.post("/api/check", checkLoggedIn);
app.get("/api/public", publicAPI);


// b/c authorize middleware passed before privateAPI handler
// will only execute privateAPI if authorize doesn't send a response
app.get("/api/private", authorize, privateAPI);





let booksDB = [
    {
        id: 1,
        author_id: 1,
        title: "Harry Potter",
        pub_year: "2000",
        genre: "Fantasy",
    },
    {
        id: 2,
        author_id: 1,
        title: "The Lost Hero",
        pub_year: "2001",
        genre: "Mythology",
    },
    {
        id: 3,
        author_id: 2,
        title: "Romeo and Juliet",
        pub_year: "2003",
        genre: "Tragedy",
    },
    {
        id: 4,
        author_id: 2,
        title: "Julius Caesar",
        pub_year: "2004",
        genre: "Political Drama",
    },
    {
        id: 5,
        author_id: 3,
        title: "Jumper",
        pub_year: "2005",
        genre: "Sci-fi",
    },
    {
        id: 6,
        author_id: 3,
        title: "Impulse",
        pub_year: "2006",
        genre: "Sci-fi",
    },

];

let authorsDB = [
    {
        id: 1,
        name: "J.K. Rowling",
        bio: "Loved to dream about magical worlds",
    },
    {
        id: 2,
        name: "William Shakespeare",
        bio: null,
    },
    {
        id: 3,
        name: "James Gould",
        bio: "I always wanted to be able to teleport",
    },
];




// initialize the db with data entries.
let authorsInsertQuery = "INSERT INTO authors(id, name, bio) VALUES(?, ?, ?)";
let booksInsertQuery = "INSERT INTO books(id, author_id, title, pub_year, genre) VALUES (?, ?, ?, ?, ?)";

// initialize the authors db first since books db uses ids from authors db as foreign keys
// for (let i = 0; i < authorsDB.length; i++)
// {
// 	let {id, name, bio} = authorsDB[i];
// 	await db.run(authorsInsertQuery, [id, name, bio]);
	
// }

// for (let i = 0; i < booksDB.length; i++)
// {
// 	let {id, author_id, title, pub_year, genre} = booksDB[i];
// 	await db.run(booksInsertQuery, [id, author_id, title, pub_year, genre]);
	
// }

function isLoggedIn(req: Request) : boolean {
	try {
        // Check if the token exists in the request cookies
        let token = req.cookies.token;

        // If the token does not exist, the user is not logged in
        if (!token) {
            return false;
        }

        // Check if the token is valid (e.g., verify against token storage)
        let username = tokenStorage[token]; // Assuming tokenStorage contains valid tokens
        if (!username) {
            return false;
        }

        // If the token is valid, the user is logged in
        return true;
    } catch (err) {
        return false;
    }
}

app.get("/api/book", async (req, res) => {

	
	let result;

	let bookId: number | undefined;
	let genre: string | undefined;

	bookId = req.query.id ? parseInt(req.query.id as string, 10) : undefined;
	genre = req.query.genre ? req.query.genre.toString() : undefined;

	
	//decide which query depending what query parameter exists.
	if (bookId !== undefined)
	{	
		if (isNaN(bookId))
		{
			return res.status(400).json({error: "Invalid id."});
		}
		
		try 
		{
			result = await db.all(`SELECT * FROM books WHERE id = ?`, [req.query.id]);
			if (result.length > 0)
			{
				return res.status(200).json({results: result});
			}
			else
			{
				return res.status(404).json({results: result});
			}
		}
		catch (err)
		{
			let error = err as Object;
			return res.status(500).json({ error: error.toString() });
		}
		
		

	}
	else if (genre !== undefined)
	{
		if (typeof genre !== "string")
		{
			return res.status(400).json({error: "Invalid genre."});
		}

		try 
		{
			result = await db.all(`SELECT * FROM books WHERE genre = ?`, [req.query.genre]);
			if (result.length > 0)
			{
				return res.status(200).json({results: result});
			}
			else
			{
				return res.status(404).json({results: result});
			}
			
		}
		catch (err)
		{
			let error = err as Object;
			return res.status(500).json({ error: error.toString() });
		}
		
	}
	else if (Object.keys(req.query).length === 0)
	{
		try 
		{
			//Changed to have alphabetical sorting result = await db.all(`SELECT * FROM books`);
			result = await db.all(`SELECT * FROM books ORDER BY UPPER(title) ASC`);
			if (result.length > 0)
			{
				return res.status(200).json({results: result});
			}
			else
			{
				return res.status(404).json({results: result});
			}
		}
		catch (err)
		{
			let error = err as Object;
			return res.status(500).json({ error: error.toString() });
		}
		
	}
});

app.get("/api/author", async (req, res) => {
	let result;
	let authorId : number | undefined;

	authorId = req.query.id ? parseInt(req.query.id as string, 10) : undefined;
	//decide which query depending what query parameter exists.
	if (authorId !== undefined)
	{	
		if (isNaN(authorId))
		{
			return res.status(400).json({error: "Invalid id."});
		}

		try 
		{
			result = await db.all(`SELECT * FROM authors WHERE id = ?`, [req.query.id]);
			if (result.length > 0)
			{
				return res.status(200).json({results: result});
			}
			else
			{
				return res.status(404).json({results: result});
			}
		}
		catch (err)
		{
			let error = err as Object;
			return res.status(500).json({ error: error.toString() });
		}

	}
	else if (Object.keys(req.query).length === 0)
	{
		try 
		{
			
			result = await db.all(`SELECT * FROM authors`);
			if (result.length > 0)
			{
				return res.status(200).json({results: result});
			}
			else
			{
				return res.status(404).json({results: result});
			}
		}
		catch (err)
		{
			let error = err as Object;
			return res.status(500).json({ error: error.toString() });
		}
		
		
	}
});


function parseError(zodError: any) {
    let { formErrors, fieldErrors } = zodError.flatten();
    return [
        ...formErrors,
        ...Object.entries(fieldErrors).map(([property, message]) => `"${property}": ${message}`),
    ];
}

let bookBodySchema = z.object({
	author_id: z.number(),
	title: z.string(),
	pub_year: z.string(),
	genre: z.string(),
	username: z.string(),
});


app.post("/api/book", async (req, res) => {

	if (isLoggedIn(req) === false) {
		return res.status(401).json({error: "Login to use this function"});
	}

	let result;

	let parseResult = bookBodySchema.safeParse(req.body);

    if (!parseResult.success) {
        return res.status(400).json({ errors: parseError(parseResult.error) });
    }

    let { author_id, title, pub_year, genre, username } = parseResult.data;

	
	try
	{
		//console.log("in try-block", `my username: ${username}`);
		//console.log(author_id, title, pub_year, genre, username);
		result = await db.all(
		"INSERT INTO books(author_id, title, pub_year, genre, username) VALUES(?, ?, ?, ?, ?) RETURNING id",
		[author_id, title, pub_year, genre, username]
		);
		// let query = `INSERT INTO books(author_id, title, pub_year, genre, username) ` +
		// 	`VALUES(1, 'M', '2014', 'Horror', 'kevin') RETURNING id`;
		// result = await db.all(query);


	}
	catch (err)
	{
		let error = err as Object;
        return res.status(500).json({ error: error.toString() });
	}
	res.status(201).json({id: result});
});


let authorBodySchema = z.object({
	name: z.string(),
    bio: z.optional(z.string()),
});

app.post("/api/author", async (req, res) => {

	if (isLoggedIn(req) === false) {
		return res.status(401).json({error: "Login to use this function"});
	}

	let result;
	

    
	//let { name, bio } = req.body;

    let parseResult = authorBodySchema.safeParse(req.body);

    if (!parseResult.success) {
        return res.status(400).json({ errors: parseError(parseResult.error) });
    }

    let { name, bio } = parseResult.data;

	try 
	{
		result = await db.all(
		"INSERT INTO authors(name, bio) VALUES(?, ?) RETURNING id",
		[name, bio]
		);
		
	}
	catch (err) 
    {
    	
        let error = err as Object;
        return res.status(500).json({ error: error.toString() });
    }

    
    res.status(201).json({id: result});
	
});

app.delete("/api/book", async (req, res) => {
	
    let result;
    let authorId : number | undefined;

	//console.log("this the bookId: ", req.query.id);
    authorId = req.query.id ? parseInt(req.query.id as string, 10) : undefined;

	
    if (authorId !== undefined)
    {
    	
    	if (isNaN(authorId))
    	{
    		return res.status(400).json({error: "Invalid id."}); 
    	}

		//console.log("running....");
	    result = await db.run(
    			"DELETE FROM books WHERE id = ?", 
    			[req.query.id]
    	);
	

		if (result.changes === 1)
		{
			
			return res.status(204).json({id: result});
		}
		else
		{
			
			return res.status(404).json({error: "Invalid id"});
		}

	    
    }
    
});

//need to delete the associated books first then the author.
app.delete("/api/author", async (req, res) => {

    let result;
    let authorId : number | undefined;

    authorId = req.query.id ? parseInt(req.query.id as string, 10) : undefined;

    if (authorId !== undefined)
    {
    	
    	if (isNaN(authorId))
    	{
    		return res.status(400).json({error: "Invalid id."}); 
    	}
    	result = await db.run(
    			"DELETE FROM books WHERE author_id = ?",
    			[req.query.id]
    	);

	    result = await db.run(
    			"DELETE FROM authors WHERE id = ?", 
    			[req.query.id]
    	);
		

		if (result.changes === 1)
		{
			
			return res.status(204).json({id: result});
		}
		else
		{
			
			return res.status(404).json({error: "Invalid id"});
		}

	    
    }
    
});

const putWdigetSchema = z.object({
    author_id:z.optional(z.number()),
    title: z.optional(z.string()),
    pub_year: z.optional(z.string().refine((s) => {
		return /^\d{4}$/.test(s);
	})),
    genre: z.optional(z.string()),
	
}).strict();

type Book = {
    id: number;
    author_id: number;
    title: string;
    pub_year: number;
    genre: string;
	username: string;
};

app.put("/api/book", async (req: Request, res: Response) => {
    // TODO
    //console.log("umm.../...");
    //let { id } = req.params;
    ///console.log(id);
    //console.log(req.body);

	if (isLoggedIn(req) === false) {
		return res.status(401).json({error: "Login to use this function"});
	}

    let parseResult = putWdigetSchema.safeParse(req.body);
    if (!parseResult.success) {
		//console.log("inside the parser!?!?!")
        return res.status(400).json({ errors: parseError(parseResult.error) });
    }
	const bookId : number | undefined = req.query.id ? parseInt(req.query.id as string, 10) : undefined;

    let { author_id, title, pub_year, genre } = parseResult.data;
    //console.log(make, color, manufacture_date, notes);
	let queryArr : string[] = [];
	let queryValues = [];
	
	if (author_id) {
		queryArr.push("author_id = ?");
		queryValues.push(author_id);
	}

	if (title) {
		queryArr.push("title = ?");
		queryValues.push(title);
	}

	if (pub_year) {
		queryArr.push("pub_year = ?");
		queryValues.push(pub_year);
	}

	if (genre) {
		queryArr.push("genre = ?");
		queryValues.push(genre);
	}

	
	


	const queryStr : string = `UPDATE books SET ${queryArr.join(", ")} WHERE id = ? RETURNING id`;

    let dbResult : Response<Book[]> | undefined;
    try {
		//console.log("try block");
		if (bookId) {
			dbResult = await db.get(
				queryStr,
				[...queryValues, bookId]
			);
		}
        

        //console.log(dbResult);
    } catch (err) {
        let error = err as Object;
        return res.status(500).json({ errors: [error.toString()] });
    }
    //console.log(dbResult);
    if (dbResult === undefined) {
        return res.status(404).json();
    }
    res.status(200).json({message: "Book updated successfully"});
});

app.get("/api/user", async (req, res) => {
	try {
		//console.log(tokenStorage);
		let token = req.cookies.token;
		//console.log(`token: ${token}`)

        // If the token does not exist, the user is not logged in
        if (!token) {
            return res.status(401).json({ message: "Unauthorized - User is not logged in." });
        }

        // Check if the token is valid (e.g., verify against token storage)
        let username = tokenStorage[token]; // Assuming tokenStorage contains valid tokens
        if (!username) {
            return res.status(401).json({ message: "Unauthorized - Invalid token." });
        }

        // If the token is valid, the user is logged in
        return res.status(200).json({ results: username});
		
		
		
	} catch (err) {
		let error = err as Object;
        return res.status(500).json({ errors: error.toString() });
	}
});

// app.delete("/api/deleteAll", async (req, res) => {
// 	try {
// 		await db.run(
// 			"DELETE FROM books"
// 		);

// 		await db.run(
// 			"DELETE FROM authors"
// 		);

// 		return res.status(204).json();
// 	} catch (err) {
// 		return res.status(500).json();
// 	}
// });
// run server
let port = 3000;
let host = "localhost";
let protocol = "http";
app.listen(port, host, () => {
    console.log(`${protocol}://${host}:${port}`);
});
