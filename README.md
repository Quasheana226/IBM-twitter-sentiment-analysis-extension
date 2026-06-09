
# Brand Sentiment Analysis – Twitter/X Browser Extension

A Firefox browser extension that analyzes the sentiment of tweets in real time and displays the results as a live pie chart. Built as part of an IBM Skills Network project.

---

## What It Does

As you scroll through Twitter/X, the extension reads each tweet and sends it to a Watson NLP model to determine whether the sentiment is **positive**, **negative**, or **neutral**. The results are displayed in a popup pie chart that updates automatically as you browse.

---

## How to Install (Firefox)

1. Download or clone this repo
2. Open Firefox and go to `about:debugging#/runtime/this-firefox`
3. Click **Load Temporary Add-on...**
4. Select the `manifest.json` file from the project folder
5. Go to [x.com](https://x.com), search for a brand or topic, and start scrolling
6. Click the extension icon in the toolbar to see the sentiment pie chart

---

## Project Structure

```
twitter-sentiment-analysis-extension/
├── manifest.json                  # Extension configuration
├── Dockerfile                     # Watson NLP model setup
├── content_scripts/
│   └── tweet-sentiment.js         # Reads tweets and sends them for analysis
├── background_scripts/
│   └── background.js              # Stores and counts sentiment results
└── popup/
    ├── popup.html                 # Popup UI layout
    └── popup.js                   # Renders the pie chart using Chart.js
```

---

## How It Works

1. **Content Script** — detects tweets on the page as you scroll using Twitter's `data-testid="tweetText"` attribute
2. **Watson NLP Model** — each tweet's text is sent to a deployed IBM Watson sentiment model which returns a positive, negative, or neutral label
3. **Background Script** — stores all results and counts them up
4. **Popup** — displays a live Chart.js pie chart showing the overall sentiment breakdown

---

## Tech Stack

- JavaScript (Vanilla)
- [Chart.js](https://www.chartjs.org/) — pie chart visualization
- [IBM Watson NLP](https://www.ibm.com/products/natural-language-processing) — sentiment analysis model
- Docker — for running the Watson NLP model locally
- IBM Code Engine — for deploying the model publicly (optional)
- Firefox WebExtensions API

---

## Built By

Quasheana — IBM Skills Network Project