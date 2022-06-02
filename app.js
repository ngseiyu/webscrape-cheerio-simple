const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const URL = "https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3";

const scrapeData = async () => {
    try {
        // fetch HTML of page
        const { data } = await axios.get(URL);
        // load HTML into cheerio
        const $ = cheerio.load(data);

        // select all list items in plainlist class
        const listItems = $(".plainlist ul li");

        // populate countries index with country data
        const countries = [];
        listItems.each((idx, el) => {
            const country = { name: "", iso3: "" };
            country.name = $(el).children("a").text();
            country.iso3 = $(el).children("span").text();
            countries.push(country);
        });

        console.dir(countries);

        // write countries into json file
        fs.writeFile("countries.json", JSON.stringify(countries, null, 2), (err) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log("Data written succefully into file");
        });
    } catch (error) {
        console.log(error);
    }
};

scrapeData();