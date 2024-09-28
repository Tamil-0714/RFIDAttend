    CREATE TABLE attendanceData(
        reg_no VARCHAR(20) primary key,
        JSONData VARCHAR(255) not null default "{}"
    );
    CREATE TABLE dummyTale(
        name VARCHAR(20) ,
        age VARCHAR(255)
    );


CREATE TABLE userCred(
    id VARCHAR(20) PRIMARY KEY,
    passHash VARCHAR(255) NOT NULL
);

INSERT INTO userCred VALUES('Tamil@123','$2b$07$mGwL7yzMVDad4GSvhVm/feLZ/UhwTlNJchPDUTib8hn5yyPsWNK0e');