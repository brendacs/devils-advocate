import { auth } from '../auth.js';

const ACCESS_TOKEN = auth.access_token;
const API_KEY = auth.api_key;

const getResponses = () => {
  let settings = {
    "async": true,
    "crossDomain": true,
    "url": `https://api.typeform.com/forms/xqCi7y/responses?key=${API_KEY}`,
    "method": "GET",
    "headers": {
      "Authorization": `bearer ${ACCESS_TOKEN}`
    }
  }

  $.ajax(settings).done(function (data) {
    console.log(data);

    let items = data.items;
    let answeredItems = [];
    let latestAnswered = [];
    for (let i = 0; i < items.length; i++) {
      let item = items[i];

      // get all answered items
      if (item.answers !== null) {
        answeredItems[i] = item;

        // get all items submitted in past 24 hours
        if (item.submitted_at) {
          latestAnswered[i] = item;
        }
      }
    }

    $('.admin__info').html(`Total items: ${data.page_count} \n*Answered items: ${answeredItems.length} \n Items within 24hrs: ${latestAnswered.length}`);
    $('.admin__responses').html(JSON.stringify(answeredItems, undefined, 2));
  });
}

document.getElementById('admin__get-responses').addEventListener('click', getResponses);
