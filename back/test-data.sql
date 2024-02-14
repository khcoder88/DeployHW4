INSERT INTO authors(id, name, bio) VALUES(1, 'J.K. Rowling', 'Loved to dream about magical worlds');
INSERT INTO authors(id, name, bio) VALUES(2, 'William Shakespeare', null);
INSERT INTO authors(id, name, bio) VALUES(3, 'James Gould', 'I always wanted to be able to teleport');


INSERT INTO books(id, author_id, title, pub_year, genre, username) VALUES (1, 1, 'Harry Potter', '2000', 'Fantasy', 'kevin');
INSERT INTO books(id, author_id, title, pub_year, genre, username) VALUES (2, 1, 'The Lost Hero', '2001', 'Mythology', 'flo');
INSERT INTO books(id, author_id, title, pub_year, genre, username) VALUES (3, 2, 'Romeo and Juliet', '2003', 'Tragedy','kevin');
INSERT INTO books(id, author_id, title, pub_year, genre, username) VALUES (4, 2, 'Julius Caesar', '2004', 'Political Drama', 'flo');
INSERT INTO books(id, author_id, title, pub_year, genre, username) VALUES (5, 3, 'Jumper', '2005', 'Sci-fi', 'kevin');
INSERT INTO books(id, author_id, title, pub_year, genre, username) VALUES (6, 3, 'Impulse', '2006', 'Sci-fi', 'flo');

-- INSERT INTO books(author_id, title, pub_year, genre, username) VALUES (1, 'All the Light We Cannot See', '2000', 'Fantasy', 'flo');
-- INSERT INTO books(author_id, title, pub_year, genre, username) VALUES (1, 'Hera in the Underworld', '2001', 'Mythology', 'flo');
-- INSERT INTO books(author_id, title, pub_year, genre, username) VALUES (2, 'Rasing Hamlet', '2003', 'Tragedy','flo');
-- INSERT INTO books(author_id, title, pub_year, genre, username) VALUES (2, 'Et Tu Brute', '2004', 'Political Drama', 'flo');
-- INSERT INTO books(author_id, title, pub_year, genre, username) VALUES (3, 'The Cyberchase', '2005', 'Sci-fi', 'flo');
-- INSERT INTO books(author_id, title, pub_year, genre, username) VALUES (3, 'Looney Tunes', '2006', 'Sci-fi', 'flo');

INSERT INTO users(username, password) 
VALUES('kevin', '$argon2id$v=19$m=65536,t=3,p=4$x6Ck4EzbFb44TrSAXv7Wyg$fOMMaFSIKmnCibi58MUjlKg+eN9OpNf0PcU9lBUYESE');
INSERT INTO users(username, password) 
VALUES('flo', '$argon2id$v=19$m=65536,t=3,p=4$x6Ck4EzbFb44TrSAXv7Wyg$fOMMaFSIKmnCibi58MUjlKg+eN9OpNf0PcU9lBUYESE');