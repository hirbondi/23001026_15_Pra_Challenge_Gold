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

    var data = {"OkPercent": 23.229166666666668, "KoPercent": 76.77083333333333};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.18059895833333334, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0025, 500, 1500, "POST Register"], "isController": false}, {"data": [0.87, 500, 1500, "GET List Categories"], "isController": false}, {"data": [0.87, 500, 1500, "GET Category"], "isController": false}, {"data": [0.0875, 500, 1500, "POST Buyer Sign In"], "isController": false}, {"data": [0.0025, 500, 1500, "POST Buyer Register"], "isController": false}, {"data": [0.6275, 500, 1500, "Get List Product"], "isController": false}, {"data": [0.725, 500, 1500, "POST Create Offer-1"], "isController": false}, {"data": [0.775, 500, 1500, "POST Create Offer-0"], "isController": false}, {"data": [0.025, 500, 1500, "PUT Buyer Update Profile"], "isController": false}, {"data": [0.0825, 500, 1500, "GET List Offers"], "isController": false}, {"data": [0.0775, 500, 1500, "Get Product"], "isController": false}, {"data": [0.0925, 500, 1500, "POST Recreate Product"], "isController": false}, {"data": [0.08, 500, 1500, "GET Get Product"], "isController": false}, {"data": [0.08, 500, 1500, "DELETE Delete Product"], "isController": false}, {"data": [0.08, 500, 1500, "PUT Update Product"], "isController": false}, {"data": [0.0, 500, 1500, "PUT Update Offer"], "isController": false}, {"data": [0.08, 500, 1500, "POST Sign In"], "isController": false}, {"data": [0.0575, 500, 1500, "POST Create Offer"], "isController": false}, {"data": [0.0275, 500, 1500, "PUT Update Profile"], "isController": false}, {"data": [0.09, 500, 1500, "POST Create Product"], "isController": false}, {"data": [0.085, 500, 1500, "GET Get Profile"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3840, 2948, 76.77083333333333, 480.4494791666669, 0, 2599, 359.0, 1006.9000000000001, 1278.9499999999998, 1802.5900000000001, 36.88619073234458, 51.81281121222528, 198.26451343128025], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST Register", 200, 199, 99.5, 1225.6249999999998, 326, 2599, 1162.0, 1689.5, 2008.7999999999995, 2536.92, 1.9894360943390599, 1.221375822507485, 0.704578998020511], "isController": false}, {"data": ["GET List Categories", 200, 0, 0.0, 357.73, 45, 1164, 286.0, 681.3000000000001, 781.95, 940.7700000000002, 2.038050400986416, 2.129603446343228, 0.45944701642159114], "isController": false}, {"data": ["GET Category", 200, 0, 0.0, 357.5649999999999, 42, 923, 313.0, 663.2, 760.8, 909.4400000000005, 2.0394220277973223, 1.4518932209611797, 0.46373947467037846], "isController": false}, {"data": ["POST Buyer Sign In", 200, 180, 90.0, 456.23500000000007, 50, 1442, 387.5, 892.4000000000001, 1058.4499999999996, 1180.7200000000003, 2.0865065620631373, 1.0936432295470195, 0.6568012941556951], "isController": false}, {"data": ["POST Buyer Register", 200, 199, 99.5, 1178.750000000001, 327, 2244, 1123.5, 1664.8, 1869.3999999999999, 2212.6600000000003, 2.071787434609209, 1.2718630224788936, 0.7382867127207748], "isController": false}, {"data": ["Get List Product", 200, 0, 0.0, 655.1099999999999, 48, 1402, 646.0, 966.6, 1078.0999999999995, 1386.2900000000016, 2.041378747205863, 23.55965379173344, 0.5164847713145458], "isController": false}, {"data": ["POST Create Offer-1", 20, 0, 0.0, 517.9, 233, 875, 509.5, 731.3000000000001, 867.8999999999999, 875.0, 0.2175828718763259, 4.888262695960574, 0.15592022595981245], "isController": false}, {"data": ["POST Create Offer-0", 20, 0, 0.0, 451.45000000000005, 54, 1248, 421.5, 891.2, 1230.3499999999997, 1248.0, 0.21610407572286813, 0.2804288045122531, 0.18145144951808792], "isController": false}, {"data": ["PUT Buyer Update Profile", 200, 180, 90.0, 546.2199999999998, 73, 2055, 410.5, 1077.0000000000002, 1638.2999999999988, 1982.800000000001, 2.0865283298383983, 1.1232103944320992, 102.45914683486694], "isController": false}, {"data": ["GET List Offers", 200, 181, 90.5, 379.11999999999995, 41, 1545, 280.0, 790.0, 880.1499999999999, 1340.3600000000024, 2.1095933758767997, 0.9403553675966457, 0.48825549812773583], "isController": false}, {"data": ["Get Product", 200, 181, 90.5, 409.3199999999998, 60, 1238, 371.5, 739.9, 848.55, 1221.91, 2.0471038598143276, 1.0096480164843038, 0.46047842096643776], "isController": false}, {"data": ["POST Recreate Product", 200, 181, 90.5, 381.4499999999999, 54, 1230, 306.5, 778.5, 898.3999999999999, 1218.0, 2.0755715605184775, 1.1717959499112693, 0.8268943320032379], "isController": false}, {"data": ["GET Get Product", 200, 181, 90.5, 339.08500000000004, 47, 1456, 268.0, 669.0, 749.5999999999999, 983.7700000000002, 2.1114419036760204, 1.040833636853107, 0.4795797999672727], "isController": false}, {"data": ["DELETE Delete Product", 200, 181, 90.5, 344.0300000000001, 48, 1600, 269.5, 714.0, 823.3499999999999, 1080.97, 2.0575073298698627, 0.8684127616892136, 0.5062593230800885], "isController": false}, {"data": ["PUT Update Product", 200, 181, 90.5, 370.7000000000001, 48, 1209, 288.5, 764.4000000000001, 898.0999999999998, 1174.7700000000002, 2.048928410441339, 1.0223332396375446, 0.8947854451809204], "isController": false}, {"data": ["PUT Update Offer", 200, 200, 100.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, 2.111664836557142, 2.495228957259904, 0.0], "isController": false}, {"data": ["POST Sign In", 200, 181, 90.5, 524.9400000000003, 50, 2230, 448.0, 921.9, 1501.7499999999993, 2121.780000000003, 2.0024630295263175, 1.0323342242207916, 0.6259750274087127], "isController": false}, {"data": ["POST Create Offer", 200, 180, 90.0, 385.6200000000001, 44, 1982, 270.0, 800.9, 1236.9499999999975, 1565.96, 2.1080146717821155, 5.815403131455795, 0.8431235243897297], "isController": false}, {"data": ["PUT Update Profile", 200, 181, 90.5, 515.7300000000002, 98, 2514, 410.0, 1013.7000000000002, 1416.1, 2061.1900000000005, 2.0060180541624875, 1.0701342308174524, 98.50325390233199], "isController": false}, {"data": ["POST Create Product", 200, 181, 90.5, 371.0049999999998, 64, 1233, 316.0, 711.6, 750.8, 1026.7100000000003, 2.0396300111159835, 1.1518531632111935, 0.8243073065920842], "isController": false}, {"data": ["GET Get Profile", 200, 181, 90.5, 329.4599999999999, 49, 1049, 252.0, 613.7, 706.6999999999999, 1014.5000000000005, 2.0366598778004072, 1.0864605874490836, 0.45529491789714865], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 361, 12.245590230664858, 9.401041666666666], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in path at index 44: https://secondhand.binaracademy.org/offers/${offerId}.json", 200, 6.784260515603799, 5.208333333333333], "isController": false}, {"data": ["401/Unauthorized", 1482, 50.27137042062415, 38.59375], "isController": false}, {"data": ["404/Not Found", 905, 30.69877883310719, 23.567708333333332], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 3840, 2948, "401/Unauthorized", 1482, "404/Not Found", 905, "400/Bad Request", 361, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in path at index 44: https://secondhand.binaracademy.org/offers/${offerId}.json", 200, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["POST Register", 200, 199, "401/Unauthorized", 199, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["POST Buyer Sign In", 200, 180, "400/Bad Request", 180, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST Buyer Register", 200, 199, "401/Unauthorized", 199, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["PUT Buyer Update Profile", 200, 180, "401/Unauthorized", 180, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET List Offers", 200, 181, "404/Not Found", 181, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get Product", 200, 181, "404/Not Found", 181, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST Recreate Product", 200, 181, "401/Unauthorized", 181, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET Get Product", 200, 181, "404/Not Found", 181, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["DELETE Delete Product", 200, 181, "404/Not Found", 181, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["PUT Update Product", 200, 181, "404/Not Found", 181, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["PUT Update Offer", 200, 200, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in path at index 44: https://secondhand.binaracademy.org/offers/${offerId}.json", 200, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST Sign In", 200, 181, "400/Bad Request", 181, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST Create Offer", 200, 180, "401/Unauthorized", 180, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["PUT Update Profile", 200, 181, "401/Unauthorized", 181, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST Create Product", 200, 181, "401/Unauthorized", 181, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET Get Profile", 200, 181, "401/Unauthorized", 181, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
