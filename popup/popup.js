// Holds the latest sentiment counts received from the background script.
// Ordered as [negative, neutral, positive] to match the chart labels.
sentimentValues = [];

/**
 * Renders (or re-renders) the pie chart with the latest sentiment data.
 *
 * The existing canvas is removed and recreated on each call because
 * Chart.js does not cleanly support updating a pie chart in place —
 * recreating the canvas avoids stale chart artifacts and animation glitches.
 *
 * Colors:
 *   Red   = Negative  (-1)
 *   Blue  = Neutral   (0)
 *   Green = Positive  (1)
 *
 * @param {number[]} data - Sentiment counts as [negative, neutral, positive]
 */


function createPieChart(data) {
    //Remove the old canvas to prevent Chart.js from rednering over a stale chart 
    document.getElementById("myChart").remove();

    // Recreate the canvas fresh so Chart.js has a clean context to draw on

    const canvas = document.createElement("canvas");
    canvas.id = "myChart",
        canvas.height = 400;
    canvas.width = 400;
    document.body.appendChild(canvas);

    const ctx = document.getElementById("myChart").getContext("2d");

    const graph = {
        type: "pie",
        data: {
          labels: ["Negative", "Neutral", "Positive"],
          datasets: [
            {
              label: "Sentiment Analysis",
              data: data,
              backgroundColor: [
                "rgba(255, 99, 132, 0.3)",   // Red   — Negative
                "rgba(54, 162, 235, 0.3)",   // Blue  — Neutral
                "rgba(50, 168, 82, 0.3)",    // Green — Positive
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(50, 168, 82, 1)",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
        },
      };
     
      new Chart(ctx, graph);

}


// On popup open, request whatever sentiments the background script
// has already collected — this handles the case where tweets were
// analyzed before the popup was opened.
// NOTE: Replace "chrome" with "browser" if deploying to Firefox.

browser.runtime.sendMessage({ type: "getSentiment" });
 
// Listen for sentiment updates broadcast by the background script.
// The chart is recreated on every update so it always reflects the latest data.
browser.runtime.onMessage.addListener(function (message) {
  if (message.type === "sentimentValues") sentimentValues = message.data;
  createPieChart(sentimentValues);
});
