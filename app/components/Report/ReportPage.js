"use client";
import { React, useEffect, useState } from "react";
import StatisticCard from "./StatisticCard";
import UpperBar from "./UpperBar";
import BarChart from "./BarChart";
import PaginatedItems from "./LineChartsPagination";
import AllLineGraphs from "./AllLineGraphs";
import Modal from "./Modal";
import BackDrop from "./Backdrop";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import LoadingScreen from "./LoadingScreen";
import DataNotFound from "./DataNotFound";
import * as apiUrls from "../../api/apiUrls";
import * as formatting from "./FormattingUtils";
import { httpGet } from "@/app/api/requestUtils";
import { parseData } from "./ParsingUtils";

import dummyData from "./DummyData.json";
import dummyData2 from "./DummyData2.json";

function ReportPage(props) {
  const [showModal, setModal] = useState(false);
  const [pdfLoading, setpdfLoading] = useState(false);
  const [colsNum, setColsNum] = useState(2);
  const [dataLoading, setdataLoading] = useState(true);
  const [data, setData] = useState({});
  const [timeInterval, setTimeInterval] = useState({
    startTimeStamp: new Date("2010-12-20 02:03:00"),
    endTimeStamp: new Date("2050-02-20 02:04:00"),
  });
  const [updateData, setUpdateData] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);
  function isObjEmpty(obj) {
    return Object.values(obj).length === 0 && obj.constructor === Object;
  }

  function formatDate(inputDate) {
    const date = new Date(inputDate);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}^${hours}:${minutes}:${seconds}`;
    return formattedDate;
  }

  function showDialog() {
    setModal(true);
  }
  function hideDialog() {
    setModal(false);
  }
  function setLoading() {
    setpdfLoading(true);
  }
  function unsetLoading() {
    setpdfLoading(false);
  }
  function timeout(delay) {
    return new Promise((res) => setTimeout(res, delay));
  }
  async function downloadPdfDocument(userColsNum) {
    hideDialog();
    setLoading();

    let currPage = 1;

    const padding = 5; // padding from the edge of the page
    const interRateDist = 2; // distance between rate graphs

    function addPageNumber() {
      pdf.text(280, 205, 'page ' + currPage); //print number bottom right
      currPage++;
    }
    
    function addToPDF(canvas) {
      const imgData = canvas.toDataURL("image/png");
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pdf.internal.pageSize.getWidth() - 10;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
      if (currHeight + imgHeight >= pdf.internal.pageSize.getHeight()) {
        pdf.addPage("landscape");
        addPageNumber();
        currHeight = padding;
      }
      pdf.addImage(imgData, "PNG", padding, currHeight, imgWidth, imgHeight);
      currHeight += imgHeight;
    }

    function addRateToPDF(canvas) {
      const imgData = canvas.toDataURL("image/png");
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth =
        (pdf.internal.pageSize.getWidth() -
          padding * 2 -
          interRateDist * (userColsNum - 1)) /
        userColsNum;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
      if (currWidth + imgWidth >= pdf.internal.pageSize.getWidth()) {
        currWidth = padding;
        currHeight += imgHeight;
        if (currHeight + imgHeight >= pdf.internal.pageSize.getHeight()) {
          pdf.addPage("landscape");
          addPageNumber();
          currHeight = padding;
        }
      }
      console.log(currWidth, currHeight, imgWidth, imgHeight);
      pdf.addImage(imgData, "PNG", currWidth, currHeight, imgWidth, imgHeight);
      currWidth += imgWidth + interRateDist;
    }

    const elements = document.getElementsByClassName("print-report");
    const rateElements = document.getElementsByClassName("print-report-rate");

    const pdf = new jsPDF({
      orientation: "landscape",
      putOnlyUsedFonts: true,
      compress: true,
    });

    
    let arr = [].slice.call(elements);
    let rateElementsArr = [].slice.call(rateElements);
    
    const sections = await Promise.all(arr.map((x) => html2canvas(x)));
    const rates = await Promise.all(rateElementsArr.map((x) => html2canvas(x)));
    // add session information
    pdf.setFont("helvetica");
    pdf.setFontSize(10);
    let sessionInfo = `Note: The report provides an overview of activities and key metrics recorded from ${timeInterval[
      "startTimeStamp"
    ].toString()} to ${timeInterval["endTimeStamp"].toString()}.`;
    let splitTitle = pdf.splitTextToSize(
      sessionInfo,
      pdf.internal.pageSize.getWidth() - 10
      );
      let numLines = splitTitle.length;
      console.log(numLines);
      console.log(splitTitle);
      pdf.text(padding, padding, splitTitle);
      
      pdf.setFontSize(8);
      addPageNumber();

      let currHeight = numLines * 3 + padding;
      let currWidth = padding;
      // add first two sections
      sections.forEach(addToPDF);
      pdf.addPage("landscape");
      addPageNumber();

    // add rate title
    currHeight = padding;
    const rateHeader = document.getElementsByClassName(
      "print-report-rate-header"
    );
    let rateHeaderArr = [].slice.call(rateHeader);
    const header = await Promise.all(rateHeaderArr.map((x) => html2canvas(x)));
    header.forEach(addToPDF);

    // add rate graphs
    rates.forEach(addRateToPDF);
    unsetLoading();
    pdf.save(formatting.formatReportName());
  }

  async function getData() {
    console.log("Requesting data from the backend...");
    const request = `${apiUrls.HOSTS_RANGE_ENDPOINT}/${formatDate(
      timeInterval["startTimeStamp"]
    )}/${formatDate(timeInterval["endTimeStamp"])}`;
    console.log(request);
    httpGet(request)
      .then((response) => {
        let output = parseData(response);
        console.log("output");
        console.log(output);

        if (firstLoad) {
          setTimeInterval({
            startTimeStamp: output["minTime"],
            endTimeStamp: output["maxTime"],
          });
          setFirstLoad(false);
        }
        setData(output);
      })
      .catch((error) => {
        console.error("Error fetching data from the backend:", error);
        setData({});
      });
  }

  useEffect(() => {
    setdataLoading(true);
    getData();
    // setData(parseData(dummyData));
    setdataLoading(false);
  }, [updateData]);

  return (
    <div>
      <div className="sticky top-0 shadow-md z-50">
        <UpperBar
          onDownload={showDialog}
          isLoading={pdfLoading}
          startDate={timeInterval["startTimeStamp"]}
          endDate={timeInterval["endTimeStamp"]}
          setInterval={setTimeInterval}
          dataIsAvailable={!isObjEmpty(data)}
          setUpdateData={setUpdateData}
          updateData={updateData}
        />
      </div>
      {dataLoading ? (
        <LoadingScreen />
      ) : isObjEmpty(data) ? (
        <DataNotFound
          msg={"There is an error loading the data from the server."}
        />
      ) : (
        <div>
          <div className="my-7 print-report">
            <h1 className="text-2xl font-bold text-black m-3">
              Session Summary
            </h1>
            <div className="flex flex-wrap justify-between p-4 3xl:justify-start">
              <StatisticCard
                title="Total Links Monitored"
                number={data["numOfLinksMonitored"]}
                unit="links"
              />
              <StatisticCard
                title="Average Data Rate"
                number={data["avgDataRate"].toFixed(2)}
                unit="Kbps"
              />
              <StatisticCard
                title="Number of Hosts"
                number={data["numHosts"]}
                unit="hosts"
              />
              <StatisticCard
                title="Number of Pairs"
                number={data["numPairs"]}
                unit="pairs"
              />
            </div>
          </div>
          <div className="my-7 print-report">
            <h1 className="text-2xl font-bold text-black mt-3 ml-3">
              Links Monitored
            </h1>
            <div className="2xl:flex xl:justify-between px-4">
              <div className="my-7 xl:w-1/2">
                <h2 className="text-xl font-semi-bold text-black m-3">
                  Number of links per Host
                </h2>
                <BarChart
                  label="Number of Links"
                  data={data["linksMonitoredPerHost"]}
                  xAxisTitle="Host IP"
                />
              </div>
              <div className="my-7 xl:w-1/2">
                <h2 className="text-xl font-semi-bold text-black m-3">
                  Number of Links per Pair
                </h2>
                <BarChart
                  label="Number of Failures"
                  data={data["linksMonitoredPerPair"]}
                  xAxisTitle="Pair ID"
                />
              </div>
            </div>
          </div>
          <div className="my-7">
            <h1 className="text-2xl font-bold text-black mt-3 ml-3">
              Data Rate Per Host
            </h1>
            <div className="2xl:flex justify-center px-4">
              <PaginatedItems itemsPerPage={4} rateData={data["rateData"]} />
            </div>
          </div>

          {showModal ? (
            <Modal onDownload={downloadPdfDocument} onCancel={hideDialog} />
          ) : null}
          {showModal ? <BackDrop /> : null}
          <div className="print-report-rate-header w-full py-7 hidden-header">
            <h1 className="text-2xl font-bold text-black m-3 w-full ">
              Data Rate Per Host
            </h1>
          </div>
          <div className="w-full p-4 hidden-canvas">
            <AllLineGraphs cols={colsNum} rateData={data["rateData"]} />
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportPage;
