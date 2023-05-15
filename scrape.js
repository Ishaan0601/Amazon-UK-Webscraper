//Packages
const axios = require("axios");
const cheerio = require("cheerio");
const { EmbedBuilder, WebhookClient } = require('discord.js');

//Insert your own discord webhook
const webhookClient = new WebhookClient({ url: '' });

//Insert Amazon UK item link below
const url = "";

const product = { name: "", price: "", link: "" };

//Set interval
const handle = setInterval(scrape, 20000);

async function scrape() {
  //Fetch the data
  try {
    const { data } = await axios.get(url);
  } 
  catch (error) {
    console.log('Error getting data')
  }
  //Load up the html
  const $ = cheerio.load(data);
  const item = $("div#dp-container");
  //Extract the data that we need
  product.name = $(item).find("h1 span#productTitle").text();
  product.stock = $(item).find("div div#availability").text();
  product.link = url;
  const price = $(item)
    .find("span .a-price-whole")
    .first()
    .text()
    .replace(/[,.]/g, "");
  const priceNum = parseInt(price);
  product.price = priceNum;
  console.log(product);
  //Send a message through Discord Webhook
  if ((product.stock.includes("in stock")) && (product.stock.includes("out of stock") == false)) {
    const embed = new EmbedBuilder()
	    .setTitle(product.name)
        .setDescription(product.stock)
        .setURL(product.link)
	    .setColor(0x00FFFF);

    webhookClient.send({
        content: '',
        username: 'Amazon',
        avatarURL: 'https://i.imgur.com/lhUZ7Na.jpg',
        embeds: [embed],
    });
  }
}

scrape();
