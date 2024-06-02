# MRS
Malfunction report system for Gomibo's maintaiance team in Groningen.

## Prequisites
For the backend, you need:
- [php 8.1](https://www.php.net/manual/en/install.php)
  - php8.1-curl
  - php8.1-xml
  - php8.1-mysql
  - php8.1-mbstring
  - [php-gd](https://www.php.net/manual/en/book.image.php)
- [composer](https://getcomposer.org/download/)
- [Docker desktop](https://www.docker.com/products/docker-desktop/)

For the frontend, you need:
- [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

## Deployment
Make sure you meet all the [prequisites](#prequisites) to deploy the application.
### The setup
first off, you want to run the `setup.sh`.
```
bash setup.sh
```
### Database migration
To setup the database, follow the steps:
1. Start with the following command.
```
cd backend/
./vendor/bin/sail up mysql phpmyadmin -d
# starts docker container with mysql db and phpmyadmin db manager.
```
2. Wait until the database is ready to accept connections. See docker container logs to know when ready.
3. Migrating the database:
```
# execute in backend/
php artisan migrate
```

### Database seeding
In case you want to start with a test user.
```
# execute in backend/
php artisan db:seed
```

### start backend
```
# execute in backend/
./vendor/bin/sail up mysql phpmyadmin -d 
php artisan serve
```
Runs the app in the development mode.\
The default port 8000.


### start frontend
```
# execute in frontend/
npm start
```
Runs the app in the development mode.\
The default port 3000, Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any errors in the console.


## Testing:

For coverage value analysis install:
- [php-pcov](https://github.com/krakjoe/pcov/blob/develop/INSTALL.md)

### Backend and API tests

Ensure that the database is running.
```
# execute in backend/
php artisan migrate --database=testing
php artisan test
```
For coverage analysis execute:
```
php artisan test --coverage
```


## Additional information

### How to view database using phpMyAdmin:
The default setting is:
1. go to [http://localhost:8001](http://localhost:8001)
2. login with credentials in `.env` file (default username=`root`, empty password)

### OpenAPI api specification
To test out the API through the openAPI specification 
1. Either go to `https://editor.swagger.io/` and open apispec.yml.\
Or\
Install the Swagger Viewer vscode extension (testing might not work)\
2. change the `cors.php` file located in `backend/config/` and change the `'allowed_origins'` value to `'allowed_origins' => ['*']`.\
This allows any location to send requests to your backend. For security reasons, set the value back to your frontend url.


## Testing
You can test the api if you have the backend and database running.


### Mailing
This application has the capability to automatically send emails to reporters who choose to receive so. To enable this a mailing host is required. To enable mailing please set the correct values in the `.env` file for `MAIL_HOST`, `MAIL_PORT`,`MAIL_USERNAME` and `MAIL_PASSWORD` corresponding to those of your host.