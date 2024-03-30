FROM php:8.1-fpm

RUN apt update && apt install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    zip 
RUN apt clean && rm -rf /var/lib/apt/lists/*

# PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd
# RUN apt install zip unzip php-zip
# RUN apt-get install php-zip
# RUN docker-php-ext-configure zip --with-libzip
# RUN docker-php-ext-install zip

# RUN docker-php-ext-install pdo_mysql
# RUN docker-php-ext-install mbstring
# RUN docker-php-ext-install exif
# RUN docker-php-ext-install pcntl
# RUN docker-php-ext-install bcmath
# RUN docker-php-ext-install gd

# RUN docker-php-ext-configure zip
# RUN docker-php-ext-install libzip
# RUN docker-php-ext-install zip


COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# copies backend files to current working dir
WORKDIR /var/www
COPY . .

RUN composer update
RUN php artisan key:generate

EXPOSE 80 

# Setup laravel to run on startup
CMD ["php", "artisan", "serve" ]
