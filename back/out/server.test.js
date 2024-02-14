import axios from "axios";
let port = 3000;
let host = "localhost";
let protocol = "http";
let baseUrl = `${protocol}://${host}:${port}`;
axios.defaults.baseURL = baseUrl;
// let __dirname = url.fileURLToPath(new URL("..", import.meta.url));
// let dbfile = `${__dirname}database.db`;
// let db = await open({
//     filename: dbfile,
//     driver: sqlite3.Database,
// });
// await db.get("PRAGMA foreign_keys = ON");
// data entries for books db
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
// function wrapper() {
//     let db: Database;
//     async function inner() {
//         if (!db) {
//             db = await open({
//                 filename: "./database.db",
//                 driver: sqlite3.Database,
//             });
//         }
//         return db;
//     }
//     return inner;
// }
// await getDB to get a db you can run queries on
// let getDB = wrapper();
// beforeEach(async () => {
//     let db = await getDB();
//     for (let { id, name, bio } of authorsDB) {
//         await db.run("INSERT INTO authors(id, name, bio) VALUES(?, ?, ?, ?, ?)", [id, name, bio]);
//     }
//     for (let { id, author_id, title, pub_year, genre } of booksDB) {
//         await db.run("INSERT INTO books(id, author_id, title, pub_year, genre) VALUES(?, ?, ?, ?, ?)", [id, author_id, title, pub_year, genre]);
//     }
// });
// beforeEach(async () => {
//     let validEntry;
//     let response;
//     for (let { id, name, bio } of authorsDB) {
//         validEntry = {
//             name: name,
//             bio: bio,
//         };
//         response = await axios.post("/api/author", validEntry);
//     }
//     for (let { id, author_id, title, pub_year, genre } of booksDB) {
//         validEntry = { 
//             author_id: author_id, 
//             title: title,
//             pub_year: pub_year,
//             genre: genre
//         };
//         response = await axios.post("/api/book", validEntry);
//     }
// });
// afterEach(async () => {
//     await axios.delete("/api/deleteAll");
// });
// afterEach(async () => {
//     await db.run("DELETE FROM books");
//     await db.run("DELETE FROM authors");
// });
// afterEach(async () => {
//     await (await getDB()).run("DELETE FROM books");
//     await (await getDB()).run("DELETE FROM authors");
// });
test("/GET /book id works", async () => {
    let id = 1;
    let response = await axios.get(`/api/book?id=${id}`);
    //let response = await axios.get(`/book/${id}`);
    expect(response.data).toEqual({ results: [booksDB[0]] });
});
test("/GET /book id does not exist", async () => {
    let id = 100;
    try {
        let response = await axios.get(`/api/book?id=${id}`);
    }
    catch (err) {
        let error = err;
        if (error.response === undefined) {
            throw Error("Server never sent response");
        }
        expect(error.response.status).toEqual(404);
    }
});
test("/GET /book id not correct type", async () => {
    let id = "string";
    try {
        let response = await axios.get(`/api/book?id=${id}`);
    }
    catch (err) {
        let error = err;
        if (error.response === undefined) {
            throw Error("Server never sent response");
        }
        expect(error.response.status).toEqual(400);
    }
});
test("/GET /author id works", async () => {
    let id = 1;
    let response = await axios.get(`/api/author?id=${id}`);
    //let response = await axios.get(`/author/${id}`);
    expect(response.data).toEqual({ results: [authorsDB[0]] });
});
test("/GET /author id does not exist", async () => {
    let id = 100;
    try {
        let response = await axios.get(`/api/author?id=${id}`);
    }
    catch (err) {
        let error = err;
        if (error.response === undefined) {
            throw Error("Server never sent response");
        }
        expect(error.response.status).toEqual(404);
    }
});
test("/GET /author id is not correct type", async () => {
    let id = "string";
    try {
        let response = await axios.get(`/api/author?id=${id}`);
    }
    catch (err) {
        let error = err;
        if (error.response === undefined) {
            throw Error("Server never sent response");
        }
        expect(error.response.status).toEqual(400);
    }
});
test("/GET /book returns nothing", async () => {
    try {
        let response = await axios.get("/api/book");
    }
    catch (err) {
        let error = err;
        if (error.response === undefined) {
            throw Error("Server never sent response");
        }
        expect(error.response.status).toEqual(404);
    }
});
test("/GET /author works to get all rows", async () => {
    let response = await axios.get("/api/author");
    //let expectedResult = authorsDB.map(author => ({name: author.name}));
    expect(response.data).toEqual({ results: authorsDB });
});
test("/GET /author returns nothing", async () => {
    try {
        let response = await axios.get("/api/author");
    }
    catch (err) {
        let error = err;
        if (error.response === undefined) {
            throw Error("Server never sent response");
        }
        expect(error.response.status).toEqual(404);
    }
});
test("/GET /book filter works", async () => {
    let genre = "Mythology";
    let response = await axios.get(`/api/book?genre=${genre}`);
    expect(response.data).toEqual({ results: [booksDB[1]] });
});
test("/GET /book filter returns nothing", async () => {
    try {
        let genre = "xyxyx";
        let response = await axios.get(`/api/book?genre=${genre}`);
    }
    catch (err) {
        let error = err;
        if (error.response === undefined) {
            throw Error("Server never sent response");
        }
        expect(error.response.status).toEqual(404);
    }
});
test("POST /book valid body", async () => {
    let response;
    let validEntry = { author_id: 3,
        title: "Little Red Riding Hood",
        pub_year: "2023",
        genre: "Horror"
    };
    try {
        response = await axios.post("/api/book", validEntry);
        expect(response.status).toEqual(201);
    }
    catch (err) {
        let error = err;
        if (error.response === undefined) {
            throw Error("Server never sent response");
        }
        //expect(error.response.status).toEqual(500);
    }
});
//Invalid POST request test for booksDB.
test("POST /book invalid author_id", async () => {
    let invalidEntry = { author_id: "invalid",
        title: "Little Red Riding Hood",
        pub_year: "2023",
        genre: "Fairytale"
    };
    let response;
    try {
        response = await axios.post(`/api/book`, invalidEntry);
        fail("Should've returned error response");
    }
    catch (err) {
        let error = err;
        if (error.response === undefined) {
            throw Error("Server never sent response");
        }
        expect(error.response.status).toEqual(400);
    }
});
// //Valid POST request for authorsDB.
test("POST /author works", async () => {
    let validEntry = {
        name: "Toni Morrison",
        bio: "I'm from Ohio.",
    };
    let response;
    try {
        response = await axios.post("/api/author", validEntry);
        expect(response.status).toEqual(201);
    }
    catch (err) {
        let error = err;
        if (error.response === undefined) {
            throw Error("Server never sent response");
        }
        //expect(error.response.status).toEqual(400);
    }
});
// //Invalid POST request for authorsDB.
test("POST /author invalid name", async () => {
    let invalidEntry = {
        name: 11,
        bio: "I have telekinesis!",
    };
    let response;
    try {
        response = await axios.post("/api/author", invalidEntry);
        //fail("Should've returned error response");
    }
    catch (err) {
        let error = err;
        if (error.response === undefined) {
            throw Error("Server never sent response");
        }
        expect(error.response.status).toEqual(400);
    }
});
test("DELETE /book given a valid id", async () => {
    let id = 2;
    let response = await axios.delete(`/api/book?id=${id}`);
    expect(response.status).toEqual(204);
});
test("DELETE /book given an id doesn't exist", async () => {
    let response;
    let id = 10;
    try {
        response = await axios.delete(`/api/book?id=${id}`);
    }
    catch (err) {
        let error = err;
        if (error.response === undefined) {
            throw Error("Server never sent response");
        }
        expect(error.response.status).toEqual(404);
    }
});
test("DELETE /book given an id isn't the correct type", async () => {
    let response;
    let id = "string";
    try {
        response = await axios.delete(`/api/book?id=${id}`);
    }
    catch (err) {
        let error = err;
        if (error.response === undefined) {
            throw Error("Server never sent response");
        }
        expect(error.response.status).toEqual(400);
    }
});
test("DELETE /author given a valid id", async () => {
    let response;
    let id = 3;
    response = await axios.delete(`/api/author?id=${id}`);
    expect(response.status).toEqual(204);
});
test("DELETE /author given an id doesn't exist", async () => {
    let response;
    let id = 10;
    try {
        response = await axios.delete(`/api/author?id=${id}`);
    }
    catch (err) {
        let error = err;
        if (error.response === undefined) {
            throw Error("Server never sent response");
        }
        expect(error.response.status).toEqual(404);
    }
});
test("DELETE /author given an id isn't the correct type", async () => {
    let response;
    let id = "string";
    try {
        response = await axios.delete(`/api/author?id=${id}`);
    }
    catch (err) {
        let error = err;
        if (error.response === undefined) {
            throw Error("Server never sent response");
        }
        expect(error.response.status).toEqual(400);
    }
});
// test("PUT /api/book with valid body updates book", async () => {
//     // TODO
//     //"/api/widgets/:id"
//     let widgetId = 1;
//     let response = await axios.put('/api/widgets/1', {color: 'green'});
//     expect(response.status).toEqual(200);
//     let dbWidget = await (
//         await getDB()
//     ).get("SELECT color FROM widgets WHERE id = ?", [widgetId]);
//     expect(dbWidget).toEqual({color: "green"});
// });
test("PUT /api/book with valid body updates one column", async () => {
    let bookId = 1;
    let validEntry = {
        author_id: null,
        title: null,
        pub_year: null,
        genre: "Horror",
    };
    let response = await axios.put(`/api/book?id=${bookId}`, { genre: "Gore" });
    expect(response.status).toEqual(200);
    let getBook = await axios.get(`/api/book?id=${bookId}`);
    expect(getBook.data.results[0].genre).toEqual("Gore");
});
test("PUT /widgets/:id with invalid shape returns errors", async () => {
    // TODO
    let widgetId = 1;
    try {
        let response = await axios.put(`/api/book?id=${widgetId}`, { color: "purple" });
        //fail("Should've returned error response");
    }
    catch (err) {
        let error = err;
        if (error.response === undefined) {
            throw Error("Server never sent response");
        }
        expect(error.response.status).toEqual(400);
    }
});
test("PUT /widgets/non-existent id returns error", async () => {
    let widgetId = 999;
    try {
        let response = await axios.put(`/api/widgets/${widgetId}`, { genre: "Historical" });
        fail("Should've returned error response");
    }
    catch (err) {
        let error = err;
        if (error.response === undefined) {
            throw Error("Server never sent response");
        }
        expect(error.response.status).toEqual(404);
    }
});
test("PUT /api/book with valid body updates two columns", async () => {
    let bookId = 1;
    let response = await axios.put(`/api/book?id=${bookId}`, { pub_year: "2013", genre: "Adventure" });
    expect(response.status).toEqual(200);
    let getBook = await axios.get(`/api/book?id=${bookId}`);
    expect(getBook.data.results[0].genre).toEqual("Adventure");
    expect(getBook.data.results[0].pub_year).toEqual("2013");
});
