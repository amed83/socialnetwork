-- DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS friend_requests;

CREATE TABLE users (
   id SERIAL primary key,
   firstname VARCHAR(255) not null,
   lastname VARCHAR(255) not null,
   email VARCHAR(255) not null UNIQUE,
   password VARCHAR(255) not null,
   image VARCHAR (255),
   bio VARCHAR(255),
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE friend_requests (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL,
    recipient_id INTEGER NOT NULL,
    status INTEGER NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CREATE TABLE general_chat (
--     id SERIAL PRIMARY KEY,
--     message VARCHAR,
--     firstname VARCHAR(255) not null,
--     lastname VARCHAR(255) not null,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- )
