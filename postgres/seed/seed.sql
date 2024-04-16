BEGIN TRANSACTION
INSERT INTO users(name, email, entries, joined) values ('Jessie', 'jessie@gmail.com', 5, '2018-01-01')

COMMIT;