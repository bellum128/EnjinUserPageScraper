import { parse } from 'node-html-parser';
import {decode} from 'html-entities';
import moment from 'moment';
import * as fs from 'fs';

const CONFIG = JSON.parse(fs.readFileSync(`./config.json`, "utf8"));
const SCRAPE_DIR = CONFIG.scrapeDir;
const HTML_FILE_COUNT = CONFIG.htmlFileCount;

console.log("Starting Enjin User HTML scraper.");

const finalUserList = [];

for(let fileIndex = 1; fileIndex <= HTML_FILE_COUNT; fileIndex++) {
    const scrapeFile = `${fileIndex}.html`;
    const data = fs.readFileSync(`${SCRAPE_DIR}${scrapeFile}`, "utf8")
    const root = parse(data);
    const userTable = root.querySelectorAll(".table-users")[0].removeWhitespace();
    const userTableBody = userTable.childNodes[1].childNodes;
    
    userTableBody.forEach(currUserParent => {
        const currUserFinal = {}

        const currUserID = currUserParent._attrs["data-user-id"];
        const currUserNameAndLabels = currUserParent.querySelector(".name-and-labels");
        const currUserLastJoined = currUserParent.childNodes[5].childNodes[0];
        const currUserLastJoinedMoment = moment(currUserLastJoined._rawText, "MMM D, YY");
        const currUserLastSeen = currUserParent.childNodes[6].childNodes[0];
        const currUserLastSeenMoment = moment(currUserLastSeen._rawText, "MMM D, YY");
        const currUserLabels = currUserParent.querySelector(".labels");
        const currUserRegularLabels = currUserLabels.querySelectorAll(".label-regular");

        currUserFinal["id"] = currUserID;
        currUserFinal["displayName"] = decode(currUserNameAndLabels.childNodes[0].childNodes[0].childNodes[0]._rawText);
        currUserFinal["lastJoined"] = !currUserLastJoinedMoment.isValid() ? null : currUserLastJoinedMoment.format("YYYY-MM-DD");
        currUserFinal["lastSeen"] = !currUserLastSeenMoment.isValid() ? null : currUserLastSeenMoment.format("YYYY-MM-DD");;
        currUserFinal["labels"] = [];

        currUserRegularLabels.forEach(currLabel => {
            currUserFinal["labels"].push(currLabel.childNodes[0]._rawText);
        });

        finalUserList.push(currUserFinal);
    });
}

const output = JSON.stringify(finalUserList);
const writeFilename = `${SCRAPE_DIR}\\out\\users.json`;
fs.writeFileSync(writeFilename, output);

console.log(`Done. Output for ${finalUserList.length} total users written to ${writeFilename}`);