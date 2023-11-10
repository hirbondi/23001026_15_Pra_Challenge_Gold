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

    var data = {"OkPercent": 94.11411411411412, "KoPercent": 5.885885885885886};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.06591591591591592, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.06887755102040816, 500, 1500, "GET List Categories"], "isController": false}, {"data": [0.05102040816326531, 500, 1500, "GET Category"], "isController": false}, {"data": [0.07397959183673469, 500, 1500, "POST Buyer Sign In"], "isController": false}, {"data": [0.08673469387755102, 500, 1500, "Get List Product"], "isController": false}, {"data": [0.002551020408163265, 500, 1500, "PUT Buyer Update Profile"], "isController": false}, {"data": [0.08461538461538462, 500, 1500, "GET List Offers"], "isController": false}, {"data": [0.09948979591836735, 500, 1500, "Get Product"], "isController": false}, {"data": [0.11224489795918367, 500, 1500, "POST Recreate Product"], "isController": false}, {"data": [0.05612244897959184, 500, 1500, "GET Get Product"], "isController": false}, {"data": [0.11734693877551021, 500, 1500, "DELETE Delete Product"], "isController": false}, {"data": [0.11989795918367346, 500, 1500, "PUT Update Product"], "isController": false}, {"data": [0.0, 500, 1500, "PUT Update Offer"], "isController": false}, {"data": [0.08673469387755102, 500, 1500, "POST Sign In"], "isController": false}, {"data": [0.06377551020408163, 500, 1500, "POST Create Offer"], "isController": false}, {"data": [0.0, 500, 1500, "PUT Update Profile"], "isController": false}, {"data": [0.05357142857142857, 500, 1500, "POST Create Product"], "isController": false}, {"data": [0.04336734693877551, 500, 1500, "GET Get Profile"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3330, 196, 5.885885885885886, 2598.242042042036, 24, 360710, 2260.0, 3891.5000000000005, 4699.0, 5959.040000000001, 5.3317877019834885, 8.221474910776616, 34.34237963899554], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["GET List Categories", 196, 0, 0.0, 2452.8112244897957, 665, 8013, 2208.0, 3807.5000000000005, 4391.499999999997, 6299.980000000002, 0.4648967383698728, 0.4857807715388319, 0.29158427943377474], "isController": false}, {"data": ["GET Category", 196, 0, 0.0, 2586.280612244899, 687, 6993, 2330.0, 4059.7000000000003, 4590.349999999992, 6637.01, 0.46521011594650086, 0.33118962355956943, 0.29268944406204384], "isController": false}, {"data": ["POST Buyer Sign In", 196, 0, 0.0, 2087.8877551020405, 782, 7087, 1941.5, 2976.3, 3241.9999999999995, 4895.770000000002, 0.4729912351828256, 0.917410315673385, 0.3579202050513533], "isController": false}, {"data": ["Get List Product", 196, 0, 0.0, 2560.3877551020414, 742, 15891, 2290.5, 4273.100000000001, 4938.899999999998, 5752.560000000012, 0.46766435061464456, 1.025583558913778, 0.30841930791641214], "isController": false}, {"data": ["PUT Buyer Update Profile", 196, 0, 0.0, 3293.17857142857, 996, 7541, 3161.0, 4278.3, 4725.449999999998, 5830.890000000002, 0.4734036514879608, 0.6881033783147312, 23.434709639470512], "isController": false}, {"data": ["GET List Offers", 195, 0, 0.0, 2257.4051282051278, 24, 5404, 2052.0, 3357.200000000001, 4525.999999999997, 5390.5599999999995, 0.4787825664218737, 0.5834011608635764, 0.3041952516738975], "isController": false}, {"data": ["Get Product", 196, 0, 0.0, 2257.1275510204086, 555, 6213, 1971.5, 4010.4000000000065, 4921.45, 5493.260000000001, 0.4699552343661958, 0.8109106791332683, 0.2967706987107402], "isController": false}, {"data": ["POST Recreate Product", 196, 0, 0.0, 2067.607142857145, 400, 5558, 2001.5, 2964.6, 3738.4499999999994, 5462.9400000000005, 0.4729958009556446, 0.845516758470486, 0.37821470479994207], "isController": false}, {"data": ["GET Get Product", 196, 0, 0.0, 2267.0459183673493, 34, 8286, 2153.5, 3141.000000000001, 3663.8999999999996, 5942.480000000003, 0.47609909662625494, 0.8191398061353627, 0.30007640965412374], "isController": false}, {"data": ["DELETE Delete Product", 196, 0, 0.0, 2067.637755102041, 622, 5310, 2010.0, 2905.2000000000007, 3453.849999999994, 5304.18, 0.4728394734112232, 0.46074425928249024, 0.30863292398140485], "isController": false}, {"data": ["PUT Update Product", 196, 0, 0.0, 2162.163265306122, 687, 6894, 2040.5, 3235.4, 4579.749999999998, 5243.060000000002, 0.474119371646694, 0.8499560162059322, 0.3995941108810396], "isController": false}, {"data": ["PUT Update Offer", 195, 195, 100.0, 2288.3538461538456, 30, 5265, 2117.0, 3579.8000000000015, 4362.4, 5132.519999999999, 0.4817634022872644, 0.18113174793027031, 0.33580125128779065], "isController": false}, {"data": ["POST Sign In", 196, 0, 0.0, 2397.163265306123, 686, 6202, 2137.5, 4163.0, 4821.15, 5617.090000000001, 0.46387348560690506, 0.9002987812670846, 0.3289067880547844], "isController": false}, {"data": ["POST Create Offer", 196, 1, 0.5102040816326531, 4232.280612244898, 49, 360710, 2209.5, 3214.2, 3819.4999999999955, 33940.280000000384, 0.32900479406985644, 0.8627540266367989, 0.2398146342297595], "isController": false}, {"data": ["PUT Update Profile", 196, 0, 0.0, 3687.9744897959195, 1618, 14112, 3514.5, 5317.100000000001, 5736.249999999999, 8404.520000000006, 0.4620309560740569, 0.6729679404145078, 22.872995520833825], "isController": false}, {"data": ["POST Create Product", 196, 0, 0.0, 2856.1479591836733, 773, 31290, 2468.0, 4254.4, 5418.7999999999965, 7674.380000000027, 0.46618383341063424, 0.8354001101537694, 0.3757036982529999], "isController": false}, {"data": ["GET Get Profile", 196, 0, 0.0, 2645.341836734694, 410, 6922, 2399.5, 4181.5, 4936.999999999999, 6649.43, 0.46285691345284175, 0.6739680401433912, 0.28951157526029797], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500/Internal Server Error", 195, 99.48979591836735, 5.8558558558558556], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, 0.5102040816326531, 0.03003003003003003], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 3330, 196, "500/Internal Server Error", 195, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["PUT Update Offer", 195, 195, "500/Internal Server Error", 195, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["POST Create Offer", 196, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
