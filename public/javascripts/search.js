$(document).ready(function () {
    $(searchNav).addClass("active");
    $(submitbutton).click(function () {
        //$(tableDiv).html("<img src=\"/images/kat-loading.gif\" class=\"center-block\">");
        $(tableDiv).html("<img src='/images/loading-gears-animation-3.gif' class='center-block'>");
        
        var address = encodeURIComponent($('#address').val());
        var zip = encodeURIComponent($('#zip').val());
        var name = encodeURIComponent($('#name').val());
        var party = encodeURIComponent($('#party').val());
        var gender = encodeURIComponent($('#gender').val());
        var city = encodeURIComponent($('#city').val());
        var bedrooms = encodeURIComponent($('#bedrooms').val());
        var bathrooms = encodeURIComponent($('#bathrooms').val());
        
        var url = "/query/?"
        var jsonText;
        
        if (address) url = url + "address=" + address + "&";
        if (zip) url = url + "zip=" + zip + "&";
        if (name) url = url + "name=" + name + "&";
        if (party) url = url + "party=" + party + "&";
        if (gender) url = url + "gender=" + gender + "&";
        if (city) url = url + "city=" + city + "&";
        if (bedrooms) url = url + "bedrooms=" + bedrooms + "&";
        if (bathrooms) url = url + "bathrooms=" + bathrooms + "&";
        
        var request = $.ajax({
            method: "GET",
            url: url,   
            dataType: "json"
        });

        request.done(function (data) {            
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
            
            for (var i = 0; i < data.length; i++) {
                var dataitem = "<tr><td>" + data[i].name + "</td><td>" + data[i].gender + "</td><td>" + data[i].age + "</td><td>" + data[i].race + "</td><td>" + data[i].party + "</td><td>" + data[i].address + "</td><td>" + data[i].city + "</td><td>" + data[i].zip + "</td><td>" + data[i].taxAssessment + "</td><td>" + data[i].finishedSqFt + "</td><td>" + data[i].yearBuilt + "</td><td>" + data[i].lastSoldDate + "</td><td>" + data[i].lastSoldPrice + "</td></tr>";
                tableData = tableData + dataitem;
            };
            
            var footer = "</tbody></table>";
            var htmltosend = tableHeader + tableData + footer;
            $(tableDiv).html(htmltosend);

        })

        request.fail(function (jqXHR, textStatus) { 
            $(tableDiv).html("Something unexpected happened.  This could help: " + textStatus);
        })
    })
})

$('#searchform').keypress(function (e) {
 var key = e.which;
 if(key == 13)  // the enter key code
  {
    $('input[name = submitbutton]').click();
    return false;  
  }
}); 