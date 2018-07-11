import "chart.js";
import randomColor from "randomcolor";

const canvas = document.getElementById("word-count");
const ctx = canvas.getContext("2d");
window.chart = null;

document.getElementById("path-form").addEventListener("submit", e => {
  e.preventDefault();
  const filePath = document.getElementById("filePath").value;
  fetch("/test", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      filePath,
    }),
  })
    .then(data => data.json())
    .then(data => {
      if (chart) {
        return;
      }

      const colours = data.map(() => randomColor());

      window.chart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: data.map(record => record.name),
          datasets: [
            {
              label: "# of Words",
              backgroundColor: colours,
              data: data.map(record => record.wordCount),
            },
          ],
        },
        options: {
          responsive: false,
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
        },
      });

      e.target.reset();
    })
    .catch(() => {
      alert("An error has occured, please try again.");
    });
});
