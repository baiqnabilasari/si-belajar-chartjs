import { Chart, registerables } from "chart.js";
import { createCanvas } from "canvas";
import http from "http";

// Daftarkan semua komponen Chart.js
Chart.register(...registerables);

const server = http.createServer((req, res) => {
  const width = 600;
  const height = 400;

  // Plugin untuk menampilkan label nilai di atas grafik
  const showDataLabels = {
    id: "showDataLabels",
    afterDatasetsDraw(chart) {
      const { ctx } = chart;
      chart.data.datasets.forEach((dataset, i) => {
        const meta = chart.getDatasetMeta(i);
        meta.data.forEach((element, index) => {
          const value = dataset.data[index];
          ctx.fillStyle = "#000";
          ctx.font = "bold 13px 'Segoe UI', sans-serif";
          ctx.textAlign = "center";
          const pos = element.tooltipPosition();
          ctx.fillText(value, pos.x, pos.y - 8);
        });
      });
    },
  };

  // Fungsi pembuat grafik (Pie, Bar, Line, Doughnut)
  const buatChart = (type, title, labels, dataset) => {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    new Chart(ctx, {
      type: type,
      data: {
        labels: labels,
        datasets: [dataset],
      },
      options: {
        responsive: false,
        plugins: {
          legend: {
            display: true,
            labels: {
              font: { size: 13 },
              color: "#333",
            },
          },
          title: {
            display: true,
            text: title,
            color: "#111",
            font: {
              size: 18,
              weight: "bold",
            },
            padding: { top: 10, bottom: 20 },
          },
        },
        scales:
          type === "pie" || type === "doughnut"
            ? {}
            : {
                y: {
                  beginAtZero: true,
                  ticks: {
                    color: "#555",
                    font: { size: 12 },
                  },
                },
                x: {
                  ticks: {
                    color: "#555",
                    font: { size: 12 },
                  },
                },
              },
      },
      plugins: [showDataLabels],
    });

    return canvas.toBuffer("image/png");
  };

  // Data Siswa
  const labels = ["Nabila", "Rozi", "Azka"];

  // Chart 1: Pie Chart
  const pie = buatChart("pie", "Pie Chart - Nilai UTS", labels, {
    label: "Nilai UTS",
    data: [80, 60, 50],
    backgroundColor: [
      "rgba(255, 99, 132, 0.7)",
      "rgba(54, 162, 235, 0.7)",
      "rgba(75, 192, 192, 0.7)",
    ],
    borderColor: [
      "rgba(255, 99, 132, 1)",
      "rgba(54, 162, 235, 1)",
      "rgba(75, 192, 192, 1)",
    ],
    borderWidth: 2,
  });

  // Chart 2: Bar Chart
  const bar = buatChart("bar", "Bar Chart - Nilai UAS", labels, {
    label: "Nilai UAS",
    data: [90, 60, 45],
    backgroundColor: [
      "rgba(255, 159, 64, 0.7)",
      "rgba(153, 102, 255, 0.7)",
      "rgba(75, 192, 255, 0.7)",
    ],
    borderColor: [
      "rgba(255, 159, 64, 1)",
      "rgba(153, 102, 255, 1)",
      "rgba(75, 192, 255, 1)",
    ],
    borderWidth: 2,
    borderRadius: 6,
  });

  // Chart 3: Line Chart
  const line = buatChart("line", "Line Chart - Nilai Harian", labels, {
    label: "Nilai Harian",
    data: [70, 82, 60],
    fill: false,
    borderColor: "rgba(54, 162, 235, 1)",
    backgroundColor: "rgba(54, 162, 235, 0.5)",
    tension: 0.3,
    pointStyle: "circle",
    pointRadius: 6,
    pointHoverRadius: 8,
  });

  // Chart 4: Doughnut Chart
  const doughnut = buatChart("doughnut", "Doughnut Chart - Kehadiran", labels, {
    label: "Kehadiran (%)",
    data: [95, 87, 92],
    backgroundColor: [
      "rgba(255, 205, 86, 0.7)",
      "rgba(75, 192, 192, 0.7)",
      "rgba(255, 99, 132, 0.7)",
    ],
    borderColor: [
      "rgba(255, 205, 86, 1)",
      "rgba(75, 192, 192, 1)",
      "rgba(255, 99, 132, 1)",
    ],
    borderWidth: 2,
  });

  // Bangun HTML halaman (layout bisa discroll)
  let html = `
  <!DOCTYPE html>
  <html lang="id">
  <head>
    <meta charset="UTF-8" />
    <title>📊 Multi Grafik Chart.js (Server-side)</title>
    <style>
      body {
        font-family: 'Segoe UI', sans-serif;
        background: #f4f6f8;
        margin: 0;
        padding: 30px;
        text-align: center;
        overflow-y: scroll;
      }
      h1 {
        color: #111;
        margin-bottom: 40px;
      }
      .chart-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 60px;
      }
      img {
        margin: 10px 0;
        border-radius: 12px;
        box-shadow: 0 3px 10px rgba(0,0,0,0.2);
        background: #fff;
      }
    </style>
  </head>
  <body>
    <h1>📊 Contoh Multi Grafik Chart.js (Server-side)</h1>
    <div class="chart-container">
      <div>
        <img src="data:image/png;base64,${pie.toString("base64")}" width="400" height="400" />
      </div>
      <div>
        <img src="data:image/png;base64,${bar.toString("base64")}" width="500" height="350" />
      </div>
      <div>
        <img src="data:image/png;base64,${line.toString("base64")}" width="500" height="350" />
      </div>
      <div>
        <img src="data:image/png;base64,${doughnut.toString("base64")}" width="400" height="400" />
      </div>
    </div>
  </body>
  </html>
  `;

  // Kirim hasilnya ke browser
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(html);
});

// Jalankan server
server.listen(3000, () => {
  console.log("✅ Server berjalan di http://localhost:3000");
});
