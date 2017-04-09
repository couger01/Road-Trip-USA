/*
Rank
Name of business (hover image_url)
Address
Phone Number
URL Link
*/

function myTable(data){
 	console.log("good");
	var obj = data;
	var businesses = obj["businesses"];
	console.log(businesses);
	//var businesses = obj["results"]["businesses"];
	//clearTable();
	//buildTable(businesses);
}

function clearTable(){
	let tbody = document.getElementById("tbody");
	tbody.innerHTML = "";
}

function buildTable(lob){
	let tbody = document.getElementById("tbody");
	for (let i = 0; i < lob.length; i++){
		let row = buildRow(lob[i]);
		tbody.appendChild(row);
	}
}

function buildRow(busi){
	var name = busi.name;
	var rank = busi.rating;
	var address = busi.location.display_address;
	//var phone = busi.display_phone;
	var rowURL = busi.url;

	var row = document.createElement("tr");
	for (let i of [rank, name, address, rowURL]){
		let td = document.createElement("td");
		if (i == rowURL){
			td.innerHTML = '<a href="' + rowURL + '">Click Here For More Info</a>';
		} else {
			td.innerHTML = i;
		}
		row.appendChild(td);
	}
	return row;
}