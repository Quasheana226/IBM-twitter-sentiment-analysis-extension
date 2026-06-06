// Persisted cache of all tweet sentiments received from the content script.
// Stored here (rather than in the content script alone) so the data survives
// page navigations and is accessible to the popup at any time.

let tweetSentiment = {};


 
// Holds the most recently calculated [negative, neutral, positive] counts.
// Updated on every incoming message so the popup always gets fresh data.

let sentimentValues = [];


 
/**
 * Counts the number of positive, negative, and neutral sentiments
 * from the cached tweetSentiment object.
 *
 * Uses reduce for a single-pass count instead of three separate loops.
 * The result is returned as an ordered array [negative, neutral, positive]
 * matching the structure Chart.js expects for the pie chart display.
 *
 * Scores:  1 = positive | -1 = negative | 0 = neutral
 *
 * @param {Object} obj - The tweetSentiment object (text -> sentiment score)
 * @returns {number[]} Array of counts ordered as [negative, neutral, positive]
 */


function counSentiments(obj) {
    
  // Convert the object's values into a flat array of sentiment scores

  let values = Object.values(obj);

  
  // Single-pass count of each sentiment value using reduce.
  // The -1 key is stringified because object keys must be strings.

  let counts = values.reduce(
    (acc, val) => {
        acc[val == -1 ? String(val) : val]++;
        return acc;
    }, 
    {"-1": 0, 0: 0, 1: 0}
  );


  // Return as an ordered array so callers don't need to know the key names

  return Object.values(counts);


}

/**
 * Listens for messages from the content script and the popup.
 *
 * - When a "sentiment" message arrives (from tweet-sentiment.js),
 *   the tweetSentiment cache is updated with the latest data.
 * - After every message (regardless of type), sentiment counts are
 *   recalculated and broadcast as a "sentimentValues" message so the
 *   popup always has up-to-date numbers without needing to request them.
 *
 * 
 */

chrome.runtime.onMessage.addListner(function (message) {
    //Update the local sentiment cache when the content script semds mew data 
    if(message.type === "sentiment") tweetSentiment = message.data;

    
  // Recalculate counts and push updated values to the popup.
  // This runs on every message so the popup stays in sync automatically.
  sentimentValues = countSentiments(tweetSentiment);
  chrome.runtime.sendMessage({
    type: "sentimentValues",
    data: sentimentValues,
  });
});