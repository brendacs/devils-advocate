import { auth } from '../../auth.js';

const ACCESS_TOKEN = auth.access_token;
const API_KEY = auth.api_key;

let settings = {
  "async": true,
  "crossDomain": true,
  "url": `https://api.typeform.com/forms/xqCi7y/responses?key=${API_KEY}`,
  "method": "GET",
  "headers": {
    "Authorization": `bearer ${ACCESS_TOKEN}`
  }
}

const getData = () => {
  let score = false
  getResponses(score);
}

const getScore = () => {
  let score = true;
  getResponses(score);
}

const getResponses = (score) => {
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

const calcScore = (latestAnswered) => {
  // econ - 1 space
    // econ govt programs - 1 space before
  // dove - 2 spaces
  // soc - 3 spaces
    // soc hate speech - 1 space before
  // nation - 4 spaces
  // part - 5 spaces

  let email;
  let econScore;
  let doveScore;
  let socScore;
  let nationScore;
  let part;
  let action;
  let vote;
  let scores;

  let results = {}
  let showScore = '';
  for (let i = 0; i < latestAnswered.length; i++) {
    econScore = 0;
    doveScore = 0;
    socScore = 0;
    nationScore = 0;
    let all = [];

    for (let j = 0; j < latestAnswered[i].answers.length; j++) {
      if (latestAnswered[i].answers[j].choice === undefined) {
        email = latestAnswered[i].answers[j].email;
      } else {
        all.push(latestAnswered[i].answers[j].choice.label);
      }
    }

    let actionArr = all.filter((item) => item.indexOf('      ') !== -1);
    let partArr = all.filter((item) => item.indexOf('     ') !== -1 && item.indexOf('      ') === -1);
    let nation = all.filter((item) => item.indexOf('    ') !== -1 && item.indexOf('     ') === -1);
    let soc = all.filter((item) => item.indexOf('   ') !== -1 && item.indexOf('    ') === -1);
    let dove = all.filter((item) => item.indexOf('  ') !== -1 && item.indexOf('   ') === -1);
    let econ = all.filter((item) => item.indexOf(' ') !== -1 && item.indexOf('  ') === -1);
    let voteArr = all.filter((item) => item.indexOf(' ') === -1);

    for (let i = 0; i < econ.length; i++) {
      if (econ[i].indexOf('beneficial') !== -1) econScore++;
      else if (econ[i].startsWith(' ') && econ[i].indexOf('Agree')) econScore++;
      else if (!econ[i].startsWith(' ') && econ[i].indexOf('Disagree')) econScore++;
    }

    for (let i = 0; i < dove.length; i++) {
      if (dove[i].indexOf('Agree') !== -1) doveScore++;
    }

    for (let i = 0; i < soc.length; i++) {
      if (soc[i].indexOf('embedded') !== -1) socScore++;
      else if (soc[i].startsWith(' ') && soc[i].indexOf('Agree')) socScore++;
      else if (!soc[i].startsWith(' ') && soc[i].indexOf('Disagree')) socScore++;
    }

    for (let i = 0; i < nation.length; i++) {
      if (nation[i].indexOf('Agree') !== -1) nationScore++;
    }

    if (actionArr[0].indexOf('external') !== -1) {
      action = 'victimhood';
    } else {
      action = 'autonomy';
    }

    if (partArr[0].indexOf('Agree') !== -1) {
      part = 'partisan'
    } else {
      part = 'nonpartisan';
    }

    vote = voteArr[0];
    
    scores = [econScore, doveScore, socScore, nationScore, action, part, vote];
    results[email] = scores;
    showScore += `${email}\nEconomic score: ${econScore}\nHawk/dove score: ${doveScore}
Social score: ${socScore}\nNational score: ${nationScore}\nAction: ${action}\nPartisan: ${part}\nVotes: ${vote}\n\n`
  }

  $('.admin__responses').html(`${showScore}\n\n${JSON.stringify(results, undefined, 2)}`);
}

document.getElementById('admin__get-responses').addEventListener('click', getData);
document.getElementById('admin__get-score').addEventListener('click', getScore);
