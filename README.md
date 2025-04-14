#  InvestigateEasy



## Tech Stack

- **Framework**: NodeJS (ExpressJS)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma


## Setup Instructions

### Prerequisites
- Node.js 18.x or higher
- npm or yarn
- Docker

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ReedwanHossain/investigate-easy-api
   cd investigate-easy-api
   ```

2. Create .env from .env.example:

   ```bash
   touch .env
   cp .env.example .env
   ```

3. Install Dependencies 
   ```bash
   npm install
   ``` 

4. Run application 
   ```bash
   npm run dev
   ```
5. Create PostgreSQL container with Docker
   ```bash
    docker run --name postgres -e POSTGRES_PASSWORD=admin -e POSTGRES_USER=admin -p 5432:5432  -d postgres 
   ```

6. MigarRun Prisma migration to set up your database schema:
    ```bash
    npx prisma migrate dev --name init
    ```

7. Run application 
   ```bash
   npm run dev
   ```
