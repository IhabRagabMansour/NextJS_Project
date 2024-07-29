import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import {
  faTable,
  // faPlus,
  faChartColumn,
  faDesktop,
  faList,
  faComputer,
  faCode,
} from "@fortawesome/free-solid-svg-icons";

function CommonUpperNavBar({ active }) {
  return (
    <div className="flex items-center">
      <Link href="/graphicalView">
        {active == "graphicalView" ? (
          <div className="inline-flex gap-3 p-2 mr-4 items-center bg-white rounded-md shadow-md ">
            <FontAwesomeIcon icon={faDesktop} size="2x" />{" "}
            <span className="font-bold">Graphical View</span>
          </div>
        ) : (
          <div
            className="inline-flex gap-3 p-2 mr-4 items-center rounded-md \
            animate max-w-12 hover:bg-white hover:shadow-md hover:max-w-52"
          >
            <span>
              <FontAwesomeIcon icon={faDesktop} size="2x" />
            </span>
            <span className="font-bold text-nowrap">Graphical View</span>
          </div>
        )}
      </Link>
      <Link href="/table" >
        {active == "table" ? (
          <div className="inline-flex gap-3 p-2 mr-4 items-center bg-white rounded-md shadow-md">
            <FontAwesomeIcon icon={faTable} size="2x" />{" "}
            <span className="font-bold">Tabular View</span>
          </div>
        ) : (
          <div
            className="inline-flex gap-3 p-2 mr-4 items-center rounded-md \
            animate max-w-12 hover:bg-white hover:shadow-md hover:max-w-52"
          >
            <span>
              <FontAwesomeIcon icon={faTable} size="2x" />
            </span>
            <span className="font-bold text-nowrap">Tabular View</span>
          </div>
        )}
      </Link>
      {/* <Link href="/createPairs">
        {active == "addPair" ? (
          <div className="inline-flex gap-3 p-2 mr-4 items-center bg-white rounded-md shadow-md ">
            <FontAwesomeIcon icon={faPlus} size="2x" />{" "}
            <span className="font-bold">Add Pair</span>
          </div>
        ) : (
          <div
            className="inline-flex gap-3 p-2 mr-4 items-center rounded-md \
            animate max-w-12 hover:bg-white hover:shadow-md hover:max-w-52"
          >
            <span>
              <FontAwesomeIcon icon={faPlus} size="2x" />
            </span>
            <span className="font-bold text-nowrap">Add pair</span>
          </div>
        )}
      </Link> */}

      <Link href="/report">
        {active == "report" ? (
          <div className="inline-flex gap-3 p-2 mr-4 items-center bg-white rounded-md shadow-md ">
            <FontAwesomeIcon icon={faChartColumn} size="2x" />{" "}
            <span className="font-bold">Report</span>
          </div>
        ) : (
          <div
            className="inline-flex gap-3 p-2 mr-4 items-center rounded-md \
            animate max-w-12 hover:bg-white hover:shadow-md hover:max-w-52"
          >
            <span>
              <FontAwesomeIcon icon={faChartColumn} size="2x" />
            </span>
            <span className="font-bold text-nowrap">Report</span>
          </div>
        )}
      </Link>

      <Link href="/viewPairs">
        {active == "viewPairs" ? (
          <div className="inline-flex gap-3 p-2 mr-4 items-center bg-white rounded-md shadow-md ">
            <FontAwesomeIcon icon={faList} size="2x" />{" "}
            <span className="font-bold">View Pairs</span>
          </div>
        ) : (
          <div
            className="inline-flex gap-3 p-2 mr-4 items-center rounded-md \
            animate max-w-12 hover:bg-white hover:shadow-md hover:max-w-52"
          >
            <span>
              <FontAwesomeIcon icon={faList} size="2x" />
            </span>
            <span className="font-bold text-nowrap">View Pairs</span>
          </div>
        )}
      </Link>

      <Link href="/viewHosts">
        {active == "viewHosts" ? (
          <div className="inline-flex gap-3 p-2 mr-4 items-center bg-white rounded-md shadow-md ">
            <FontAwesomeIcon icon={faComputer} size="2x" />{" "}
            <span className="font-bold">view Hosts</span>
          </div>
        ) : (
          <div
            className="inline-flex gap-3 p-2 mr-4 items-center rounded-md \
            animate max-w-12 hover:bg-white hover:shadow-md hover:max-w-52"
          >
            <span>
              <FontAwesomeIcon icon={faComputer} size="2x" />
            </span>
            <span className="font-bold text-nowrap">view Hosts</span>
          </div>
        )}
      </Link>
      <Link href="/developmentLogs">
        {active == "developmentLogs" ? (
          <div className="inline-flex gap-3 p-2 mr-4 items-center bg-white rounded-md shadow-md ">
            <FontAwesomeIcon icon={faCode} size="2x" />{" "}
            <span className="font-bold">Development logs</span>
          </div>
        ) : (
          <div
            className="inline-flex gap-3 p-2 mr-4 items-center rounded-md \
            animate max-w-12 hover:bg-white hover:shadow-md hover:max-w-52"
          >
            <span>
              <FontAwesomeIcon icon={faCode} size="2x" />
            </span>
            <span className="font-bold text-nowrap">Development logs</span>
          </div>
        )}
      </Link>
    </div>
  );
}

export default CommonUpperNavBar;
