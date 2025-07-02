# 🏆 Bounty Board

Bounty Board is a platform where users can post and claim bounties. The system consists of two servers:  
1. **Main Server** (Next.js) – Handles frontend and user interactions.  
2. **Verus Server** (Express.js) – Manages authentication, payments, and external integrations for verus.  
3. **Database** (MongoDB) – Stores users, bounties, and transactions.  
   
## **🛠️ Technologies Used**
- **Frontend:** React, Tailwind CSS  
- **Backend:** Express.js, Next.js  
- **Database:** MongoDB  
- **Authentication:** JWT (JSON Web Tokens)  
- **API Communication:** REST API between servers  

## 📋 Prerequisites

Before installing and running this project, make sure you have the following installed on your system:

1. **MongoDB** – Database for storing bounties and users  
   - [Download & Install MongoDB](https://www.mongodb.com/try/download/community)  
   - Ensure MongoDB is running:  
     ```sh
     mongod --version
     ```

2. **Nginx** – Used as a reverse proxy for production  
   - Install on Ubuntu/Debian:  
     ```sh
     sudo apt update && sudo apt install nginx -y
     ```
   - Install on macOS (Homebrew):  
     ```sh
     brew install nginx
     ```

3. **Node.js** (v18+) – Required for running Next.js and Express  
   - [Download Node.js](https://nodejs.org/)  
   - Check installation:  
     ```sh
     node -v
     ```

4. **Yarn** – Package manager for dependencies  
   - Install globally:  
     ```sh
     npm install -g yarn
     ```
   - Verify installation:  
     ```sh
     yarn -v
     ```

## 🛠 **Installation & Setup**

1. **Clone the repository**:
```bash
$ git clone https://github.com/darkddev/bounty-board.git
$ cd bounty-board
```

2. **Install dependencies**

* Install for the Main Server:
```bash
$ cd web
$ yarn install
```

* Install for Verus Server
```bash
$ cd verus
$ yarn install
```
3. **Set up environment variables**: 
Create a .env file in web(main server) and verus(server). 

🌍 Main Server (.env)
```bash
NEXT_PUBLIC_APP_URL=https://bountyboard.com
MONGODB_URI=mongodb://localhost:27017/bountyboard
SESSION_SECRET=your_secret_key
```

🔐 Verus Server (.env)
```bash
APP_URL=https://bountyboard.com
CHAIN="VRSC"
CHAIN_IADDRESS="i5w......B6MGV"
API="https://api.verus.services"

SIGNING_IADDRESS="iAv9t.....PAdtk"
PRIVATE_KEY="UxC9.....pmW1xnP"
```
## Running the Project:

1. **Configure Nginx**: 

Create a new Nginx configuration file:

```bash
$ sudo nano /etc/nginx/sites-available/bountyboard
```

Add the following configuration:

```bash
server {
    # listen 5000;
    listen 80;
    server_name yourdomain.com; # Change to your domain or IP

    location / {
        proxy_pass http://localhost:3000; # Next.js Main Server
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the configuration:
```bash
$ sudo ln -s /etc/nginx/sites-available/bountyboard /etc/nginx/sites-enabled/
```

Restart nginx:
```bash
$ sudo systemctl restart nginx
```

2. **Start the Database (MongoDB)**: 

Ensure MongoDB is running locally

3. **Start the Verus Server (Express.js)**: 

```bash
$ cd verus
$ yarn start
```
Runs on http://localhost:9000

Or you can run the verus server using pm2

```bash
$ cd verus
$ pm2 start "yarn start" --name verus-server
```

4. **Start the Main Server (Next.js)**: 

```bash
$ cd web
$ yarn build
$ yarn start
```
Runs on http://localhost:3000

Or you can run the verus server using pm2

```bash
$ cd verus
$ yarn build
$ pm2 start "yarn start" --name main-server
```

