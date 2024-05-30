# Backend

Create using Node.

## DATABASE
Enter to mysql command line and create the database.

```sql
- CREATE DATABASE user_management;
- USE user_management;

- CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        user_role VARCHAR(100),
        status ENUM('active', 'inactive') DEFAULT 'active',
        social_profile JSON,
        promote BOOLEAN DEFAULT false,
        rating INT DEFAULT 0,
        last_login DATETIME
    );
```

## Run the app

- node server.js´

Go to http://localhost:5000/api/users


## API CRUD

- GET

![image](https://github.com/Msabalza730/Tecnopac_test/assets/55921624/feae77b6-51aa-4b13-9d97-20811d505df7)

- POST

![image](https://github.com/Msabalza730/Tecnopac_test/assets/55921624/8324982f-7ca9-4265-9785-107a9f490973)

- PUT

![image](https://github.com/Msabalza730/Tecnopac_test/assets/55921624/07ad59aa-c507-41b6-ada6-5e4498181ece)


- DELETE

![image](https://github.com/Msabalza730/Tecnopac_test/assets/55921624/463be624-0a45-4b15-913b-b678366f661e)


## Documentation 

Go to http://localhost:5000/docs/

![image](https://github.com/Msabalza730/Tecnopac_test/assets/55921624/6e474742-e3b2-48a2-ad1c-cf7772596707)

