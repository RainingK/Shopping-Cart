# Shopping-Cart
## Stack
* Backend - The backend stack used is django with the django rest framework
* frontend - The frontend application is created with vite and react.
* db - The db used is SQLite because there is no setup required for it. PostgreSQL is also used but only if you have run the project with docker

# How to run
There are 2 ways to run the project, with docker or manually installing it.

For either of the methods the URL of the backend and frontend is the same

Backend - http://localhost:8000

Frontend - http://localhost:5173


## With Docker (Recommended)
Run docker compose with the command
```
docker compose up --build
```

The credentials for the admin page:
- username: admin
- password: password

Note: If you're getting import errors on the frontend, delete the container and image and rebuild the image with `docker compose up --build`

## Manually
### Server
1. Create a virtual environment inside the server folder (Optional but recommended)
```
cd server
python -m venv .venv
```
2. Activate virutal environment

Windows
```
./.venv/Scripts/activate
```
Linux/Mac
```
source .venv/bin/activate
```
3. Install the python packages
```
pip install -r requirements.txt
```
4. Apply the django migrations
```
python manage.py migrate
```
5. Run the initialization Script
```
python manage.py initialize_data
```
6. (Optional) Create superuser to access the admin page
```
python manage.py createsuperuser
```
7. Run the server
```
python manage.py runserver
```

### Frontend
1. Install the packages in another terminal
```
cd frontend
npm install
```
2. Run the frontend
```
npm run dev
```

## Endpoints
|Method|URL|Description|
|-|-|-|
|GET|/cart/get-cart-list/|Get list of cart items|
|POST|/cart/place-order/|Place an order from cart. Reduces the stock from the inventory and creates an Order object|

## Models
All the models by default store the id(UUID), created_at (Datetime), updated_at(DateTime)

### Product
The product model mainly stores the name of the product
* name: CharField

### Inventory
Inventory shows the stocks for a given product.
* product: Foreign Key (Product) - Its linked to the product table
* stock: InterField - Shows the current available stock for the product
* price: DecimalField - As well as the price for the product

### Cart
Cart stores the items the user would like to purchase. In this case it is always a set of the same items linked ot the inventory. This list can be viewed from the frontend
* inventory: Foreign Key (Inventory) - It's linked to the inventory
* quantity: IntegerField - It stores the quantity the user wishes to purchase

### Order
This is just to store the items from the cart that the user has purchases. You can only view this from the django admin page.
* order_number: IntegerField - The only field I've added to this is the order_number.
* total_price: Property (Integer) - There is a property field that calculates the total price of the items and not a hard total incase the price of the item changes.

### OrderItem
This is a list of all the items that the user ordered that is linked via the Order model
* order: Foreign Key (Order) - Is linked with the Order model
* product: Foreign Key (Product) - Each item is linked with the product
* quantity: IntegerField - Quantity purchased is stored
* price: DecimalField - Price at the time of purchase is also stored