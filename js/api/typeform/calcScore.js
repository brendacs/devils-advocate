export const calcScore = (latestAnswered) => {

  /* econ - 1 space suffix
   *   econ govt programs - 1 space prefix
   * dove - 2 space suffix
   * soc - 3 spaces suffix
   *   soc hate speech - 1 space prefix
   * nation - 4 spaces suffix
   * part - 5 spaces suffix */

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
  let scoreString = '';
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
    scoreString += `${email}\nEconomic score: ${econScore}\nHawk/dove score: ${doveScore}\nSocial score: ${socScore}\nNational score: ${nationScore}\nAction: ${action}\nPartisan: ${part}\nVotes: ${vote}\n\n`
  }

  $('.admin__responses').html(`${scoreString}\n\n${JSON.stringify(results, undefined, 2)}`);
}
