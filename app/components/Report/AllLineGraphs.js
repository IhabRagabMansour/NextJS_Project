import React from "react";
import LineChart from "./LineChart";

function AllLineGraphs({ rateData }) {
  let cols = 1;
  const items = Object.keys(rateData);
  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: "Timestamp",
        },
        ticks: {
          maxTicksLimit: 10,
        },
      },
      y: {
        title: {
          display: true,
          text: "Data Rate (Kbps)",
        },
      },
    },
  };
  const rows = items.reduce(function (rows, key, index) {
    return (
      (rows.push([
            <div key={key} className="w-full">
              <h3>Pair #{key}</h3>
              <LineChart
                data={{
                  labels: rateData[key].map((record) =>
                    record.timeStamp.toLocaleString()
                  ),
                  datasets: [
                    {
                      label: "Average Rate",
                      data: rateData[key].map((record) => record.avgDataRate),
                      backgroundColor: "rgba(96 165 250)",
                    },
                    {
                      label: "Total Rate",
                      data: rateData[key].map((record) => record.totDataRate),
                      backgroundColor: "rgba(34 34 34)",
                    },
                  ],
                }}
                options={options}
                className="w-full h-full"
              />
            </div>,
          ])
        ) && rows
    );
  }, []);

  return (
    <>
      {rows.map((row, index) => (
        <div className="print-report-rate flex w-full p-4" key={index}>
          {row}
        </div>
      ))}
    </>
  );
}

export default AllLineGraphs;
