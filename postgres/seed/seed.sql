BEGIN TRANSACTION;
INSERT INTO users(name, email, entries, joined) values ('a', 'a@gmail.com', 5, '2018-01-01');
INSERT INTO login(hash, email) values ('$2a$12$XWTa1KB47m/JPakzuMUixudY3s/kHKKwA3pjZ8KcdSsEZdJs.fI3G', 'a@gmail.com');
COMMIT;