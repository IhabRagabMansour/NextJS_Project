import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

function LineChart({ data, options }) {
  return (
    <div className="px-10 w-full flex justify-center h-full">
      <Line data={data} options={options}/>
    </div>
  );
}

export default LineChart;
