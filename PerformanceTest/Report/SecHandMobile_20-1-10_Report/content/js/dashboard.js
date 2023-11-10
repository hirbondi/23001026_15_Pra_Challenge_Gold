/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 18.959537572254334, "KoPercent": 81.04046242774567};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.0653179190751445, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.031746031746031744, 500, 1500, "POST Seller Auth Register"], "isController": false}, {"data": [0.0, 500, 1500, "POST Seller Re-Add Product"], "isController": false}, {"data": [0.044642857142857144, 500, 1500, "POST Buyer Sign In"], "isController": false}, {"data": [0.0, 500, 1500, "DELETE Seller Delete Product"], "isController": false}, {"data": [0.00819672131147541, 500, 1500, "GET Seller List Product"], "isController": false}, {"data": [0.0, 500, 1500, "GET Seller Get Product"], "isController": false}, {"data": [0.0, 500, 1500, "PUT Buyer Update Offer"], "isController": false}, {"data": [0.0, 500, 1500, "POST Seller Add Product"], "isController": false}, {"data": [0.044642857142857144, 500, 1500, "POST Buyer Auth Register"], "isController": false}, {"data": [0.011111111111111112, 500, 1500, "GET Buyer List Orders"], "isController": false}, {"data": [0.0625, 500, 1500, "GET Buyer List Product"], "isController": false}, {"data": [0.0, 500, 1500, "GET Buyer Get Product"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [0.031746031746031744, 500, 1500, "POST Seller Sign In"], "isController": false}, {"data": [0.0, 500, 1500, "POST Buyer Create Order"], "isController": false}, {"data": [0.0, 500, 1500, "GET Buyer Get Order"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 865, 701, 81.04046242774567, 14409.171098265895, 0, 304213, 3336.0, 18971.799999999996, 74037.49999999962, 229011.34000000023, 1.2815878058031482, 1217.3666734295734, 8.800329349083036], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST Seller Auth Register", 63, 61, 96.82539682539682, 3352.190476190476, 290, 16014, 2409.0, 8145.000000000001, 12139.6, 16014.0, 0.09530581062886707, 0.03169178214301923, 0.03942858351738953], "isController": false}, {"data": ["POST Seller Re-Add Product", 58, 58, 100.0, 9969.051724137928, 525, 64126, 3803.5, 26666.000000000004, 37215.24999999998, 64126.0, 0.08636131489568893, 0.03717671972551992, 4.1051258930206656], "isController": false}, {"data": ["POST Buyer Sign In", 56, 51, 91.07142857142857, 3646.892857142857, 78, 21182, 1955.5, 8243.600000000008, 17778.999999999996, 21182.0, 0.08533333333333334, 0.02969940476190476, 0.022211309523809526], "isController": false}, {"data": ["DELETE Seller Delete Product", 58, 58, 100.0, 5158.327586206897, 508, 86198, 2762.5, 8629.300000000005, 19768.749999999996, 86198.0, 0.08806786692034262, 0.029539331507949646, 0.0197037617126467], "isController": false}, {"data": ["GET Seller List Product", 61, 59, 96.72131147540983, 4013.5573770491806, 99, 14065, 3078.0, 10357.200000000006, 12344.199999999999, 14065.0, 0.09057016143760087, 0.044271560245489686, 0.017318295469561745], "isController": false}, {"data": ["GET Seller Get Product", 58, 57, 98.27586206896552, 3961.2931034482763, 88, 24563, 2404.5, 8357.400000000001, 21214.299999999992, 24563.0, 0.08847316669870006, 0.030242831194723336, 0.01789365029608003], "isController": false}, {"data": ["PUT Buyer Update Offer", 44, 44, 100.0, 4241.863636363638, 1237, 11930, 4004.0, 7553.0, 9767.5, 11930.0, 0.08186625286997035, 0.03347983787691037, 0.02026669443607176], "isController": false}, {"data": ["POST Seller Add Product", 63, 61, 96.82539682539682, 8516.063492063493, 285, 23723, 6926.0, 19758.800000000003, 21625.399999999998, 23723.0, 0.09345004205251892, 0.04051355989776862, 4.453761037395592], "isController": false}, {"data": ["POST Buyer Auth Register", 56, 51, 91.07142857142857, 4849.785714285713, 198, 42960, 2936.5, 10411.0, 19242.1, 42960.0, 0.08564747194662939, 0.029608598700299613, 0.03430140626266551], "isController": false}, {"data": ["GET Buyer List Orders", 45, 40, 88.88888888888889, 4906.577777777779, 740, 22396, 3578.0, 11626.199999999999, 16229.59999999999, 22396.0, 0.08231792646631093, 0.03179815735894824, 0.016822654373551436], "isController": false}, {"data": ["GET Buyer List Product", 56, 2, 3.5714285714285716, 4430.321428571428, 318, 15755, 3074.0, 9977.500000000004, 13856.099999999999, 15755.0, 0.08477167657183339, 0.12346471965552425, 0.019172082056712253], "isController": false}, {"data": ["GET Buyer Get Product", 52, 14, 26.923076923076923, 156103.94230769234, 4042, 304213, 173537.5, 252865.90000000002, 271806.99999999994, 304213.0, 0.0778623782464494, 1229.7489499809087, 0.01396311316622869], "isController": false}, {"data": ["Debug Sampler", 43, 0, 0.0, 0.41860465116279066, 0, 2, 0.0, 1.0, 1.7999999999999972, 2.0, 0.08348428456880366, 0.046015706451782, 0.0], "isController": false}, {"data": ["POST Seller Sign In", 63, 61, 96.82539682539682, 4484.761904761905, 236, 22747, 2348.0, 16701.4, 19965.79999999999, 22747.0, 0.09469725438087537, 0.03232759228097126, 0.025724971835082475], "isController": false}, {"data": ["POST Buyer Create Order", 45, 45, 100.0, 14131.933333333334, 2664, 45608, 13603.0, 36452.799999999996, 44781.499999999985, 45608.0, 0.07639912259852091, 0.02553269288231819, 0.020940124097641476], "isController": false}, {"data": ["GET Buyer Get Order", 44, 39, 88.63636363636364, 4477.568181818182, 1249, 17000, 3511.5, 10196.0, 16279.25, 17000.0, 0.08173182302831265, 0.02653164159295323, 0.017162304191913752], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 112, 15.977175463623395, 12.947976878612717], "isController": false}, {"data": ["502/Bad Gateway", 33, 4.70756062767475, 3.815028901734104], "isController": false}, {"data": ["504/Gateway Time-out", 1, 0.14265335235378032, 0.11560693641618497], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 16, 2.282453637660485, 1.8497109826589595], "isController": false}, {"data": ["403/Forbidden", 422, 60.19971469329529, 48.786127167630056], "isController": false}, {"data": ["401/Unauthorized", 110, 15.691868758915835, 12.716763005780347], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 22,130,188; received: 4,795,526)", 1, 0.14265335235378032, 0.11560693641618497], "isController": false}, {"data": ["404/Not Found", 6, 0.8559201141226819, 0.6936416184971098], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 865, 701, "403/Forbidden", 422, "400/Bad Request", 112, "401/Unauthorized", 110, "502/Bad Gateway", 33, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 16], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["POST Seller Auth Register", 63, 61, "400/Bad Request", 58, "502/Bad Gateway", 3, "", "", "", "", "", ""], "isController": false}, {"data": ["POST Seller Re-Add Product", 58, 58, "403/Forbidden", 54, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "504/Gateway Time-out", 1, "502/Bad Gateway", 1, "", ""], "isController": false}, {"data": ["POST Buyer Sign In", 56, 51, "401/Unauthorized", 49, "502/Bad Gateway", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["DELETE Seller Delete Product", 58, 58, "403/Forbidden", 57, "404/Not Found", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["GET Seller List Product", 61, 59, "403/Forbidden", 56, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 3, "", "", "", "", "", ""], "isController": false}, {"data": ["GET Seller Get Product", 58, 57, "403/Forbidden", 57, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["PUT Buyer Update Offer", 44, 44, "403/Forbidden", 35, "404/Not Found", 5, "502/Bad Gateway", 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", ""], "isController": false}, {"data": ["POST Seller Add Product", 63, 61, "403/Forbidden", 59, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["POST Buyer Auth Register", 56, 51, "400/Bad Request", 49, "502/Bad Gateway", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["GET Buyer List Orders", 45, 40, "403/Forbidden", 35, "502/Bad Gateway", 4, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", ""], "isController": false}, {"data": ["GET Buyer List Product", 56, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET Buyer Get Product", 52, 14, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 7, "502/Bad Gateway", 6, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 22,130,188; received: 4,795,526)", 1, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["POST Seller Sign In", 63, 61, "401/Unauthorized", 61, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST Buyer Create Order", 45, 45, "403/Forbidden", 34, "502/Bad Gateway", 6, "400/Bad Request", 5, "", "", "", ""], "isController": false}, {"data": ["GET Buyer Get Order", 44, 39, "403/Forbidden", 35, "502/Bad Gateway", 4, "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
