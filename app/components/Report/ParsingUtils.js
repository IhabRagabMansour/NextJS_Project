function parseRateData(rawRate) {
  if (rawRate == "") return 0;
  if (rawRate.endsWith("bytes-per-second")) {
    return parseFloat(rawRate) / 1000;
  } else {
    let rate = parseFloat(rawRate);
    let unit = rawRate.slice(-4);
    if (unit === "Gbps") {
      rate = rate * 1000000;
    } else if (unit === "Mbps") {
      rate += rate * 1000;
    }
    return rate;
  }
}

function isActive(rawConnection) {
  return (
    rawConnection["client-process-state"] !== "CLOSED" &&
    rawConnection["server-process-state"] !== "CLOSED"
  );
}

function getLinkKey(rawConnection) {
  return `${rawConnection["client-ip-address"]}:${rawConnection["client-port"]}-${rawConnection["server-ip-address"]}:${rawConnection["server-port"]}`;
}

function addLink2Maps(
  rawConnection,
  linksMonitoredPerPair,
  linksMonitoredPerHost,
  linksMonitored,
  host,
  record,
  category
) {
  if (isActive(rawConnection)) {
    const key = getLinkKey(rawConnection);
    if (!linksMonitored.has(host["hostIP"] + "-" + key)) {
      linksMonitored.set(host["hostIP"] + "-" + key, true);
    }
    if (!linksMonitoredPerHost.has(host["hostIP"])) {
      linksMonitoredPerHost.set(host["hostIP"], {
        local: new Map(),
        remote: new Map(),
      });
    }
    linksMonitoredPerHost.get(host["hostIP"])[category].set(key, true);

    if (!linksMonitoredPerPair.has(host["hostIP"] + ":" + record["pairID"])) {
      linksMonitoredPerPair.set(host["hostIP"] + ":" + record["pairID"], {
        local: new Map(),
        remote: new Map(),
      });
    }
    linksMonitoredPerPair
      .get(host["hostIP"] + ":" + record["pairID"])
      [category].set(key, true);
  }
}

function reduceToMaxPoints(data, maxPoints) {
  let newRateData = {};
  for (let [key, rateSeries] of Object.entries(data)) {
    if (rateSeries.length <= maxPoints) {
      newRateData[key] = rateSeries;
    } else {
      newRateData[key] = [];
      let arrLen = rateSeries.length;
      let winSize = Math.ceil(arrLen / maxPoints);
      let stIdx = 0;
      while (stIdx < arrLen) {
        let sum = {};
        let count = {};
        for (let i = stIdx; i < Math.min(arrLen, stIdx + winSize); i++) {
          for (let rateKey of Object.keys(rateSeries[i])) {
            if (rateKey === "timeStamp") {
              if (sum[rateKey] === undefined) {
                sum[rateKey] = 0;
              }
              if (count[rateKey] === undefined) {
                count[rateKey] = 0;
              }
              sum[rateKey] += rateSeries[i][rateKey].getTime();
              count[rateKey] += 1;
            } else {
              if (sum[rateKey] === undefined) {
                sum[rateKey] = 0;
              }
              if (count[rateKey] === undefined) {
                count[rateKey] = 0;
              }
              sum[rateKey] += rateSeries[i][rateKey];
              count[rateKey] += 1;
            }
          }
        }
        let avg = {};
        for (let rateKey of Object.keys(sum)) {
          if (rateKey === "timeStamp") {
            avg[rateKey] = new Date(sum[rateKey] / count[rateKey]);
          } else {
            avg[rateKey] = sum[rateKey] / count[rateKey];
          }
        }
        console.log(avg);
        newRateData[key].push(avg);
        stIdx += winSize;
      }
    }
  }
  return newRateData;
}

export function parseData(rawData) {
  if (rawData === undefined) {
    console.log("No data received");
    return {};
  }
  console.log("Data Received");
  console.log(rawData);
  const maxPoints = 120;
  let numHosts = rawData["hosts"].length; // number of hosts during session
  let numPairs = 0; // number of B C pairs accross all hosts
  let rateData = {};
  let totRate = 0.0; // total data rate accross all links in the session
  let totCount = 0; // total number of links in the session
  let linksMonitored = new Map(); // links monitored during the session identified by
  let linksMonitoredPerHost = new Map(); // links per host identified by CLIENT_IP:CLIENT_PORT-SERVER_IP:SERVER_PORT
  let linksMonitoredPerPair = new Map(); // links per pair identified by CLIENT_IP:CLIENT_PORT-SERVER_IP:SERVER_PORT
  let minTime = new Date("2050-12-20 02:03:00");
  let maxTime = new Date("2010-12-20 02:03:00");
  for (var host of rawData["hosts"]) {
    numPairs += host["pairs"].length;
    for (var pair of host["pairs"]) {
      for (var record of pair) {
        let localDataRateSum = 0.0; // total rate of local links in pair at timestamp
        let localDataRateCount = 0; // total number of local links in pair at timestamp
        let remoteDataRateCount = 0; // total number of remote links in pair at timestamp
        let remoteDataRateSum = 0.0; // total rate of remote links in pair at timestamp
        for (var localConnection of record["List-Of-Local-Connections"]) {
          localDataRateSum += parseRateData(localConnection["data-rate"]);
          addLink2Maps(
            localConnection,
            linksMonitoredPerPair,
            linksMonitoredPerHost,
            linksMonitored,
            host,
            record,
            "local"
          );
          localDataRateCount += 1;
        } // end of local connection
        for (var remoteConnection of record["List-Of-Remote-Connections"]) {
          remoteDataRateSum += parseRateData(remoteConnection["data-rate"]);
          addLink2Maps(
            remoteConnection,
            linksMonitoredPerPair,
            linksMonitoredPerHost,
            linksMonitored,
            host,
            record,
            "remote"
          );
          remoteDataRateCount += 1;
        } // end of remote connection

        if (!(host["hostIP"] + ":" + record["pairID"] in rateData)) {
          rateData[host["hostIP"] + ":" + record["pairID"]] = [];
        }
        let dataRateSum = localDataRateSum + remoteDataRateSum; // total rate of all links (local and remote) in pair at timestamp
        let dataRateCount = localDataRateCount + remoteDataRateCount; // total number of links (local and remote) in pair at timestamp
        rateData[host["hostIP"] + ":" + record["pairID"]].push({
          avgDataRate: dataRateSum / dataRateCount,
          avgLocalDataRate: localDataRateSum / localDataRateCount,
          avgRemoteDataRate: remoteDataRateSum / remoteDataRateCount,
          totLocalDataRate: localDataRateSum,
          totRemoteDataRate: remoteDataRateSum,
          totDataRate: dataRateSum,
          timeStamp: new Date(record["time-stamp"]),
        });
        if (minTime > new Date(record["time-stamp"])) {
          minTime = new Date(record["time-stamp"]);
        }
        if (maxTime < new Date(record["time-stamp"])) {
          maxTime = new Date(record["time-stamp"]);
        }
        totRate += dataRateSum;
        totCount += dataRateCount;
      } // end of record
    } // end of pair
  } // end of host
  if (numPairs == 0) {
    return {};
  }

  for (let [key, rateSeries] of Object.entries(rateData)) {
    rateSeries.sort(function (a, b) {
      return a.timeStamp < b.timeStamp
        ? -1
        : a.timeStamp == b.timeStamp
        ? 0
        : 1;
    });
  }

  rateData = reduceToMaxPoints(rateData, maxPoints);

  return {
    numHosts: numHosts,
    numPairs: numPairs,
    numOfLinksMonitored: linksMonitored.size,
    avgDataRate: totRate / totCount,
    rateData: rateData,
    linksMonitoredPerHost: linksMonitoredPerHost,
    linksMonitoredPerPair: linksMonitoredPerPair,
    minTime: minTime,
    maxTime: maxTime,
  };
}
