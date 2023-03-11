## Enjin User HTML Scraper

**Description**
A quick and dirty scraper to back up user records as JSON from Enjin in the final days of the system.

*Contains no error handling or validation.*

**Usage**

 1. Clone the repo and run `npm install`
 2. Download each page of your Admin / Users section as a `Webpage, Complete (\*.htm,\*.html)`, with file names like `1.html, 2.html,` etc.
 3. Rename `config.example.json` to `config.json`.
 4. In config.html, change scrapeDir to your the path you downloaded the HTMLs to, and `htmlFileCount` to the number of HTML files in the directory
 5. Run `npm run start` in the project directory to output the records to `scrapeDir/out/user.json`
