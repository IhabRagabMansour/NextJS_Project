import ReactPaginate from "react-paginate";
import React, { useEffect, useState } from "react";
import LineChart from "./LineChart";

function Items({ currentItems, rateData }) {
  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Timestamp'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Data Rate (Kbps)'
        }
      }
  }};
  return (
    <div className="items w-full grid grid-cols-2 gap-4">
      {currentItems &&
        currentItems.map((item) => (
          <div key={item}>
            <h3>Pair #{item}</h3>
            <LineChart
              className="w-full"
              data={{
                labels: rateData[item].map((record) =>
                  record.timeStamp.toLocaleString()
                ),
                datasets: [
                  {
                    label: "Average Rate",
                    data: rateData[item].map((record) => record.avgDataRate),
                    backgroundColor: "rgba(96 165 250)",
                  },
                  {
                    label: "Total Rate",
                    data: rateData[item].map((record) => record.totDataRate),
                    backgroundColor: "rgba(34 34 34)",
                  },
                ],
              }}
              options={options}
            />
          </div>
        ))}
    </div>
  );
}

function PaginatedItems({ itemsPerPage, rateData }) {
  const items = Object.keys(rateData);
  // We start with an empty list of items.
  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = useState(0);

  useEffect(() => {
    // Fetch items from another resources.
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(items.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(items.length / itemsPerPage));
  }, [itemOffset, itemsPerPage]);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % items.length;
    setItemOffset(newOffset);
  };

  return (
    <div className="flex flex-col items-center w-full px-10 gap-4">
      <Items
        className="w-full mb-4"
        currentItems={currentItems}
        rateData={rateData}
      />
      <ReactPaginate
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={2}
        marginPagesDisplayed={1}
        pageCount={pageCount}
        previousLabel="< previous"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item rounded-l border-l-2"
        previousLinkClassName="page-link"
        nextClassName="page-item rounded-r"
        nextLinkClassName="page-link"
        breakLabel="..."
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName="pagination my-4"
        activeClassName="active"
        renderOnZeroPageCount={null}
      />
    </div>
  );
}

export default PaginatedItems;
