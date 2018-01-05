import { getResponses } from './typeform/getResponses.js';

const getFormData = () => {
  let score = false
  getResponses(score);
}

const getScore = () => {
  let score = true;
  getResponses(score);
}

document.getElementById('admin__get-responses').addEventListener('click', getFormData);
document.getElementById('admin__get-score').addEventListener('click', getScore);
