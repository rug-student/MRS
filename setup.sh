
# backend setup
cd backend/
cp .env.example .env
composer update
php artisan key:generate
cd ..

# frontend setup
cd frontend/
cp .env.example .env
npm install react-scripts
cd ..