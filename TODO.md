# Project To tasks

## Roadmap

- [x] Recreate the routes.json more accuratly
- [x] Create and Seed postgress db with data from routes.json
- [x] Rewrite pages to use db data not routes.json
- [x] Create auth protected routes for admin
- [x] Validate and correct db entries
- [] rewrite components with user data to use the db
- [] Add support for route / sector images
- [] Add support for offline accress (service workers)
- [] UI Fixes
- [] Features

## Next up

- [x] refactor to use bd as source of data instead of routes.json
  - [x] sectors page
  - [x] routes page
  - [x] route page
  - [x] sector page
  - [x] sidebar
- [] for new route page, add in check for route numbers
- [] add error messages for

  - [] new route
  - [] edit route dialog

- [] refactor data fetching strategy to better utilise next js server side rendering

## UI Fixes and Features

[] add filters to seach page
[] tanstack ranger for sectors
[] add an all routes page with filtering
[] add sector access comments
[] create non sidebar layout for non routes pages
[] move footer into non sidebar layouts
[] options drop down / command menu / filters in home search bar
[] skeleton loading states for sectors and routes (if needed when using local db)
[] add tandstack ranger to the sectors page to handle the grade filters
[x] find a partner button
[x] key or label for colored circles in sector cards
[]

### user managemnet

[] set up clerk
[] add user account page
[] redo sidebar with user account info / sign in / sign out

### migrate to db instead of json

[] add db
[] write a schema
[] add db seeding
[] redo all imports to use db

### route management

[] add route creation page
[] add route editing page
[] add route deletion page
[] add route comments

### sector management

[] add sector creation page
[] add sector editing page
[] add sector deletion page
[] add sector comments
