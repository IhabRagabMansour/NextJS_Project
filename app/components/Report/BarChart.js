import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function BarChart(props) {
  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: props.xAxisTitle
        }
      },
      y: {
        ticks: {
          precision:0
        },
        title: {
          display: true,
          text: 'Number of Links'
        }
      }
  }};
  return (
    <div className="px-10 w-full  flex justify-center">
      <Bar className="2xl:w-4/5" data={{
    labels: Array.from(props.data.keys()),
    datasets: [
      {
        label: "Local Links",
        data:         
        Array.from(props.data.values()).map((value) => value["local"].size),
        backgroundColor: "rgba(96 165 250)",
        borderRadius: {
          topLeft: 10,
          topRight: 10,
          bottomLeft: 0,
          bottomRight: 0,
        },
      },
      {
        label: "Remote Links",
        data:         
        Array.from(props.data.values()).map((value) => value["remote"].size),
        backgroundColor: "rgba(250,96,165)",
        borderRadius: {
          topLeft: 10,
          topRight: 10,
          bottomLeft: 0,
          bottomRight: 0,
        },
      },
    ],
  }}
  options={options}/>
    </div>
  );
}

export default BarChart;
