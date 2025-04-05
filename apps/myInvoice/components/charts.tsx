"use client"

import { Bar, Line, Pie } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend)

export function LineChart() {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Revenue",
        data: [3000, 4000, 3500, 5000, 4800, 5200, 6000, 5500, 6500, 7000, 6800, 7500],
        borderColor: "hsl(var(--primary))",
        backgroundColor: "hsl(var(--primary) / 0.1)",
        tension: 0.3,
        fill: true,
      },
      {
        label: "Expenses",
        data: [2000, 2200, 2100, 2500, 2400, 2600, 2800, 2700, 3000, 3200, 3100, 3300],
        borderColor: "hsl(var(--destructive))",
        backgroundColor: "hsl(var(--destructive) / 0.1)",
        tension: 0.3,
        fill: true,
      },
    ],
  }

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  return <Line data={data} options={options} />
}

export function BarChart() {
  const data = {
    labels: ["Room A", "Room B", "Room C", "Room D", "Room E", "Room F"],
    datasets: [
      {
        label: "Capacity",
        data: [100, 120, 80, 150, 90, 110],
        backgroundColor: "hsl(var(--primary) / 0.7)",
      },
      {
        label: "Used",
        data: [80, 100, 60, 120, 70, 90],
        backgroundColor: "hsl(var(--primary))",
      },
    ],
  }

  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  return <Bar data={data} options={options} />
}

export function PieChart() {
  const data = {
    labels: ["Paid", "Pending", "Overdue"],
    datasets: [
      {
        data: [65, 25, 10],
        backgroundColor: ["hsl(var(--success))", "hsl(var(--warning))", "hsl(var(--destructive))"],
        borderColor: ["hsl(var(--success))", "hsl(var(--warning))", "hsl(var(--destructive))"],
        borderWidth: 1,
      },
    ],
  }

  const options: ChartOptions<"pie"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  }

  return <Pie data={data} options={options} />
}

