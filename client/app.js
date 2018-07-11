import "chart.js";
import randomColor from "randomcolor";

const canvas = document.getElementById("word-count");
const ctx = canvas.getContext("2d");
window.chart = null;

document.getElementById("path-form").addEventListener("submit", e => {
  e.preventDefault();
  const filePath = document.getElementById("filePath").value;
  fetch("/", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      filePath,
    }),
  })
    .then(response => response.json())
    .then(response => {
      const colours = Object.keys(response.wordCount).map(() => randomColor());
      const labels = Object.keys(response.wordCount);
      const data = Object.values(response.wordCount);

      if (window.chart) {
        window.chart.data.labels = labels;
        window.chart.data.datasets[0].data = data;
        window.chart.update();

        return;
      }

      window.chart = new Chart(ctx, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: "# of Words",
              backgroundColor: colours,
              data,
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
