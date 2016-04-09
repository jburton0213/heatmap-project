$(document).ready(function () {
    $(searchNav).addClass("active");
    $(submitbutton).click(callAPIandUpdateTable)
})

$('#searchform').keypress(function (e) {
    var key = e.which;
    if(key == 13){ // the enter key code
        // callAPIandUpdateTable()
        $(submitbutton).click(); 
    };
}); 

function callAPIandUpdateTable(pageNumber) {
        $(tableDiv).html("<img src='/images/loading-gears-animation-3.gif' class='center-block'>");
        var address = encodeURIComponent($('#address').val());
        var zip = encodeURIComponent($('#zip').val());
        var name = encodeURIComponent($('#name').val());
        var party = encodeURIComponent($('#party').val());
        var gender = encodeURIComponent($('#gender').val());
        var city = encodeURIComponent($('#city').val());
        var bedrooms = encodeURIComponent($('#bedrooms').val());
        var bathrooms = encodeURIComponent($('#bathrooms').val());
        
        var url = "/query/?";
        
        if (address) url = url + "address=" + address + "&";
        if (zip) url = url + "zip=" + zip + "&";
        if (name) url = url + "name=" + name + "&";
        if (party) url = url + "party=" + party + "&";
        if (gender) url = url + "gender=" + gender + "&";
        if (city) url = url + "city=" + city + "&";
        if (bedrooms) url = url + "bedrooms=" + bedrooms + "&";
        if (bathrooms) url = url + "bathrooms=" + bathrooms + "&";
        if (typeof pageNumber === "number") url = url + "page=" + pageNumber;
        
        var request = $.ajax({
            method: "GET",
            url: url,   
            dataType: "json"
        });

        request.done(function (data) {
            
            // $(tableDiv).html(data.items[1].gender);
                        
            var tableHeader = "";
            tableHeader = tableHeader + "<table class='table'>";
            tableHeader = tableHeader + "<thead>";
            tableHeader = tableHeader + "<tr>";
            tableHeader = tableHeader + "<th>Name</th>";
            tableHeader = tableHeader + "<th>Gender</th>";
            tableHeader = tableHeader + "<th>Age</th>";
            tableHeader = tableHeader + "<th>Race</th>";
            tableHeader = tableHeader + "<th>Party</th>";
            tableHeader = tableHeader + "<th>Address</th>";
            tableHeader = tableHeader + "<th>City</th>";
            tableHeader = tableHeader + "<th>Zip</th>";
            tableHeader = tableHeader + "<th>Tax Assessment</th>";
            tableHeader = tableHeader + "<th>Square Ft</th>";
            tableHeader = tableHeader + "<th>Year Built</th>";
            tableHeader = tableHeader + "<th>Last Sold Date</th>";
            tableHeader = tableHeader + "<th>Last Sold Price</th>";
            tableHeader = tableHeader + "</tr>";
            tableHeader = tableHeader + "</thead>";
            tableHeader = tableHeader + "<tbody>";
            var tableData = "";
            
            for (var i = 0; i < data.items.length; i++) {
                var dataitem = "<tr><td>" + data.items[i].name + "</td>";
                dataitem = dataitem + "<td>" + data.items[i].gender + "</td>";
                dataitem = dataitem + "<td>" + data.items[i].age + "</td>";
                dataitem = dataitem + "<td>" + data.items[i].race + "</td>";
                dataitem = dataitem + "<td>" + data.items[i].party + "</td>";
                dataitem = dataitem + "<td>" + data.items[i].address + "</td>";
                dataitem = dataitem + "<td>" + data.items[i].city + "</td>";
                dataitem = dataitem + "<td>" + data.items[i].zip + "</td>";
                dataitem = dataitem + "<td>" + data.items[i].taxAssessment + "</td>";
                dataitem = dataitem + "<td>" + data.items[i].finishedSqFt + "</td>";
                dataitem = dataitem + "<td>" + data.items[i].yearBuilt + "</td>";
                dataitem = dataitem + "<td>" + data.items[i].lastSoldDate + "</td>";
                dataitem = dataitem + "<td>" + data.items[i].lastSoldPrice + "</td></tr>";
                tableData = tableData + dataitem;
            };
            
            var tablefooter = "</tbody></table>";
            
            var nav = "     <div class=\"pager\">"
                nav = nav + "   <ul class=\"pagination bootpag\">"
                nav = nav + "       <li>"
                nav = nav + "           <a href=\"#\" aria-label=\"Previous\">"
                nav = nav + "           <span aria-hidden=\"true\">&laquo;</span>"
                nav = nav + "           </a>"
                nav = nav + "       </li>"
                nav = nav + "       <li><a href=\"#\">1</a></li>"
                nav = nav + "       <li><a href=\"#\">2</a></li>"
                nav = nav + "       <li><a href=\"#\">3</a></li>"
                nav = nav + "       <li><a href=\"#\">4</a></li>"
                nav = nav + "       <li><a href=\"#\">5</a></li>"
                nav = nav + "       <li>"
                nav = nav + "           <a href=\"#\" aria-label=\"Next\">"
                nav = nav + "           <span aria-hidden=\"true\">&raquo;</span>"
                nav = nav + "           </a>"
                nav = nav + "       </li>"
                nav = nav + "    </ul>"
                nav = nav + "</div>"
            
            var htmltosend = tableHeader + tableData + tablefooter + nav;
            $(tableDiv).html(htmltosend);
            
            var pageCount = 1
            
            if (data.resultsCount > 10){
                pageCount = data.resultsCount / 10
            }
            
            $('.pager').bootpag({
                total : pageCount,
                page : data.page,
                maxVisible : 10
                }).on("page", function(event, num){
                    callAPIandUpdateTable(num)
                })
        })

        request.fail(function (jqXHR, textStatus) { 
            $(tableDiv).html("Something unexpected happened.  This could help: " + textStatus);
        })
    }