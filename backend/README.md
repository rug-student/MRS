How to run backend:
first off, setup .env file (can copy from .env.example)
assuming you are in /backend, run 
    "composer update"
or
    "php composer.phar update"


to run in development mode: "./vendor/bin/sail up mysql phpmyadmin", then: "php artisan serve"

to run docker: "./vendor/bin/sail up"

to run tests: i dont know yet

to enter database using phpMyAdmin:
    - go to "localhost:8001"
    - login with credentials in .env file (default username=root, empty password)
    