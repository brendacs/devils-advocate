import { settings } from './settings.js';
import { calcScore } from './calcScore.js';

export const getResponses = (score) => {
  $.ajax(settings).done(function (data) {

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

    if (score === true) calcScore(latestAnswered);
  });
}
