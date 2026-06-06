
// Global cache of analyzed tweets — keyed by tweet text, value is sentiment score.
// Stored globally so all functions share the same state without passing it around,
// and so we avoid re-analyzing the same tweet text more than once.
tweetSentiment = {};


/**
 * Analyzes the sentiment of a given string of text and broadcasts the result.
 *
 * Currently uses a random placeholder (1, -1, or 0) — this will be replaced
 * with a real NLP model once the sentiment pipeline is implemented.
 *
 * Scores:  1 = positive | -1 = negative | 0 = neutral
 *
 * @param {string} text - The full extracted text of a tweet
 * @returns {number} The sentiment score for the given text
 *
 * NOTE: Replace "chrome" with "browser" if deploying to Firefox,
 * since Firefox uses the WebExtensions API under the "browser" namespace.
 */


function analyzeSentiment(text) {
    const sentiments = [1, -1, 0];
    const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];

    // Cache the result so we dont reproccess the same text on futur scroll events
    tweetSentiment[text] = sentiment;


    // Broadcast the updated sentiment map to the background script,
    // which will forward it to the popup for display in the chart
    chrome.runtime.sendMessage({
        type: "sentiment",
        data: tweetSentiment,

    });

    return
}

/**
 * Extracts text from a single tweet DOM element and assigns it a sentiment score.
 *
 * Twitter structures tweet text across multiple <span> elements inside a container
 * with data-testid="tweetText". We collect all span text and join it into one string
 * to get the full tweet content before running analysis.
 *
 * Skips tweets that have already been processed (checked via the "sentiment" attribute)
 * and re-uses cached results for tweets with identical text to avoid redundant work.
 *
 * LIMITATION: Does not handle tweets that contain only an image, gif, or video —
 * those have no text spans so they will be skipped silently.
 *
 * @param {Element} tweet - A DOM element with data-testid="tweetText"
 */

function categorizeTweet(tweet) {
    //skip if This dom elemnt was already processed on a previous scroll event 
    if (tweet.hasAttribute("sentiment")) return;


  // Twitter splits tweet text across many nested <span> elements.
  // We query all of them and combine their innerText into one string.

  const spans = tweet.querySelectorAll("span");
  const spanTexts = [];
  spans.forEach((span) => {
    spanTexts.push(span.innerText);
  });
  const text = spanTexts.join(" ");


  // If we've seen this exact text before, reuse the cached score
  // instead of running analysis again — saves time and keeps results consistent

  if(text in tweetSentiment) {
    tweet.setAttribute("sentiment", tweetSentiment[text]);
    return;
  }


  // New tweet text — run analysis and stamp the result onto the DOM element
  const sentiment = analyzeSentiment(text);
  tweet.setAttribute("sentiment", sentiment);

}


/**
 * Runs sentiment categorization on a collection of tweet elements.
 *
 * Iterates over each tweet and delegates to categorizeTweet,
 * which handles caching and skipping already-processed elements.
 *
 * @param {NodeList} tweets - All tweet elements currently in the DOM
 */
function categorizeAllTweets(tweets) {
    tweets.forEach((tweet) => {
      categorizeTweet(tweet);
    });
  }
   
  /**
   * Entry point for a full sentiment analysis pass on the current page.
   *
   * Queries the DOM fresh each time it's called because Twitter dynamically
   * injects new tweet elements as the user scrolls (infinite scroll behavior).
   * Re-querying ensures newly loaded tweets are always included.
   */
  function doSentimentAnalysis() {
    tweets = document.querySelectorAll('[data-testid="tweetText"]');
    categorizeAllTweets(tweets);
  }
   
  // Re-run analysis on every scroll event to catch tweets Twitter lazy-loads
  // into the DOM as the user scrolls down the feed.
  document.addEventListener("scroll", function () {
    doSentimentAnalysis();
  });
   