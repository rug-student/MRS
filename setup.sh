
# backend setup
cd backend/
cp .env.example .env
composer update
php artisan key:generate
cd ..

# frontend setup
cd frontend/
npm install react-scripts
cd ..