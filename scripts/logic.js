$(function () {
	var socket = io.connect('http://localhost:3000');

	socket.on('message', function (message) {
		$('#logs').html(message);
	});

	/*
	$('#btn_prog_on').click(function () {
		socket.emit('message', 'TAG');
		console.log('programmé!')
	});
	*/
	$('#btn_prog_off').click(function () {
		socket.emit('message', 'OFF');
		console.log('programmé!')
	});

	$('#btn_prog_on').click(function () {
		var tagTransfert = $('#id_tagData').text();
		console.log('tagTransfet: ' + tagTransfert);

		socket.emit('message', tagTransfert.substring(0, 14));
	});

});


function copyToClickBoard(content) {
	//var content = document.getElementById('textArea').innerHTML;
	if (!navigator.clipboard) {
		// Clipboard API not available
		//return
		alert('probleme presse papier');
	}

	//alert(content);

	navigator.clipboard.writeText(content)
		.then(() => {
			console.log("Text copied to clipboard...")
		})
		.catch(err => {
			console.log('Something went wrong', err);
		})
}

function convertFromHex(hex) {
	var hex = hex.toString();//force conversion
	var str = '';
	for (var i = 0; i < hex.length; i += 2)
		str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
	return str;
}

function convertToHex(str) {
	var hex = '';
	for (var i = 0; i < str.length; i++) {
		hex += '' + str.charCodeAt(i).toString(16);
	}
	return hex;
}

function strToInt(str) {
	var int = 0;
	for (var i = 0; i < str.length; i++) {
		int += Math.pow(10, (str.length - 1 - i)) * (str.charCodeAt(i) - 0x30);
	}
	return int;
}

function intToHex(int) {
	return (int.toString(16));
}

function intToStrInt(int) {
	return (int.toString(10));
}

function strFillZeroBeginning(str, len) {
	var newStr = str;
	for (var i = str.length; i < len; i++) {
		newStr = '0' + newStr;
	}
	return newStr;
}

function strAsIntToHex(str, nbBytes) {
	return (strFillZeroBeginning(intToHex(strToInt(str)), (nbBytes * 2)));
}

function stringToHex(str, nbBytes) {
	return (strFillZeroBeginning(convertToHex(str), (nbBytes * 2)));
}



function idStringToHex(id, nbBytes) {
	var str = document.getElementById(id).value;
	var hex = stringToHex(str, nbBytes);
	return (hex);
}

function idIntToHex(id, nbBytes) {
	var str = document.getElementById(id).value;
	var hex = strAsIntToHex(str, nbBytes);
	return (hex);
}

function setValueFromId(id, value) {
	document.getElementById(id).value = value;
}

function getValueFromRadioName(name) {
	var ele = document.getElementsByName(name);
	var value;
	for (i = 0; i < ele.length; i++) {
		if (ele[i].checked)
			//document.getElementById("result").innerHTML
			//    = "Gender: "+ele[i].value;
			value = ele[i].value;
	}
	return (value);
}

function getMaskFromCheckboxName(name) {
	var ele = document.getElementsByName(name);
	var mask = 0;
	for (i = 0; i < ele.length; i++) {
		if (ele[i].checked)
			//document.getElementById("result").innerHTML
			//    = "Gender: "+ele[i].value;					
			//mask+= Math.pow( 2, i) * ele[i].value;
			mask += Math.pow(2, i);
	}

	var maskFilledZero = intToHex(mask);
	maskFilledZero = strFillZeroBeginning(maskFilledZero, 2);

	return (maskFilledZero);
}

function setMaskFromCheckboxName(name, mask_p) {
	var ele = document.getElementsByName(name);
	var mask = mask_p;

	for (i = 0; i < ele.length; i++) {
		//var reste = mask % 1;			
		//if ( (mask % 1) == 1)
		if ((mask & 1) == 1)
			ele[i].checked = true;
		else
			ele[i].checked = false;

		//mask = Math.floor(mask/2);
		mask >>= 1;
	}
}

///////////////////////////////////////////////////////////////////////////////////////////////
function setClickHandlerFromRadioName(name, index, handler) {
	var ele = document.getElementsByName(name);

	ele[index].onclick = function () { if (ele[index].checked) handler(); }
	if (ele[index].checked) handler();


}

function typeBadgeMaitreClickHandler() {
	var ctrlSerial = document.getElementById("id_controllerSerial");
	var edit_codesite = document.getElementById("id_edit_codesite");
	//var items_badgeAvecFichier = document.getElementById("id_items_badgeAvecFichier");	

	//ctrlSerial.disabled = false;
	ctrlSerial.style.visibility = "visible";
	edit_codesite.style.visibility = "hidden";
	//items_badgeAvecFichier.style.visibility = "hidden"; 

}

function typeBadgeAvecFichierHandler() {
	var ctrlSerial = document.getElementById("id_controllerSerial");
	var edit_codesite = document.getElementById("id_edit_codesite");
	//ctrlSerial.disabled = true;		
	ctrlSerial.style.visibility = "hidden";
	edit_codesite.style.visibility = "visible";
}

function typeBadgeResident() {
	typeBadgeAvecFichierHandler();
	setMaskFromCheckboxName("sched1Day", 255);
	setValueFromId("id_edit_sched1_beginHr", 00);
	setValueFromId("id_edit_sched1_beginMn", 00);
	setValueFromId("id_edit_sched1_endHr", 23);
	setValueFromId("id_edit_sched1_endMn", 59);
}

function typeBadgePrestaire() {
	typeBadgeAvecFichierHandler();
	setMaskFromCheckboxName("sched1Day", 2 + 4 + 8 + 16 + 32);
	setValueFromId("id_edit_sched1_beginHr", 07);
	setValueFromId("id_edit_sched1_beginMn", 30);
	setValueFromId("id_edit_sched1_endHr", 12);
	setValueFromId("id_edit_sched1_endMn", 00);
}

//id_controllerSerial

setClickHandlerFromRadioName("radio_typeBadge", 0, typeBadgeMaitreClickHandler);
setClickHandlerFromRadioName("radio_typeBadge", 1, typeBadgeResident);
setClickHandlerFromRadioName("radio_typeBadge", 2, typeBadgePrestaire);
setClickHandlerFromRadioName("radio_typeBadge", 3, typeBadgeAvecFichierHandler);



///////////////////////////////////////////////////////////////////////////////////////////////


function libraTagEncode() {
	//hexString = yourNumber.toString(16);
	//yourNumber = parseInt(hexString, 16);
	//var nbr = 15;

	//var typeBadge = document.getElementById("id_radio_typeBadge").value;

	//var typeBadge = idToHex("id_radio_typeBadge", 1);

	var tagFile = '';
	tagFile += getValueFromRadioName("radio_typeBadge");
	tagFile += idIntToHex("id_edit_codesite", 4);
	//Champ FirstNameLastName supprime
	/*
	tagFile+=idStringToHex("id_edit_userLastName", 16);
	tagFile+=idStringToHex("id_edit_userFirstName", 16);
	*/
	tagFile += idIntToHex("id_edit_userId", 2);
	tagFile += idIntToHex("id_edit_userColor", 1);
	tagFile += idIntToHex("id_edit_userLostcounter", 1);

	tagFile += getMaskFromCheckboxName("doormaskP0");
	tagFile += getMaskFromCheckboxName("doormaskP1");
	tagFile += getMaskFromCheckboxName("doormaskP2");
	tagFile += getMaskFromCheckboxName("doormaskP3");
	tagFile += getMaskFromCheckboxName("doormaskP4");
	tagFile += getMaskFromCheckboxName("doormaskP5");
	tagFile += getMaskFromCheckboxName("doormaskP6");
	tagFile += getMaskFromCheckboxName("doormaskP7");


	//Debut validite
	tagFile += idIntToHex("id_edit_dateValidBeginDay", 1);
	tagFile += idIntToHex("id_edit_dateValidBeginMonth", 1);
	tagFile += idIntToHex("id_edit_dateValidBeginYear", 2);
	tagFile += idIntToHex("id_edit_heureValidBeginHr", 1);
	tagFile += idIntToHex("id_edit_heureValidBeginMn", 1);
	//Fin validite
	tagFile += idIntToHex("id_edit_dateValidEndDay", 1);
	tagFile += idIntToHex("id_edit_dateValidEndMonth", 1);
	tagFile += idIntToHex("id_edit_dateValidEndYear", 2);
	tagFile += idIntToHex("id_edit_heureValidEndHr", 1);
	tagFile += idIntToHex("id_edit_heureValidEndMn", 1);

	//Masque jours feriés
	tagFile += getMaskFromCheckboxName("edit_joursFeriesValid");

	//Tag validity sched1
	tagFile += idIntToHex("id_edit_sched1_beginHr", 1);
	tagFile += idIntToHex("id_edit_sched1_beginMn", 1);
	tagFile += idIntToHex("id_edit_sched1_endHr", 1);
	tagFile += idIntToHex("id_edit_sched1_endMn", 1);
	tagFile += getMaskFromCheckboxName("sched1Day");

	//Tag validity sched2
	tagFile += idIntToHex("id_edit_sched2_beginHr", 1);
	tagFile += idIntToHex("id_edit_sched2_beginMn", 1);
	tagFile += idIntToHex("id_edit_sched2_endHr", 1);
	tagFile += idIntToHex("id_edit_sched2_endMn", 1);
	tagFile += getMaskFromCheckboxName("sched2Day");

	//Tag validity sched3
	tagFile += idIntToHex("id_edit_sched3_beginHr", 1);
	tagFile += idIntToHex("id_edit_sched3_beginMn", 1);
	tagFile += idIntToHex("id_edit_sched3_endHr", 1);
	tagFile += idIntToHex("id_edit_sched3_endMn", 1);
	tagFile += getMaskFromCheckboxName("sched3Day");

	//Tag validity sched4
	tagFile += idIntToHex("id_edit_sched4_beginHr", 1);
	tagFile += idIntToHex("id_edit_sched4_beginMn", 1);
	tagFile += idIntToHex("id_edit_sched4_endHr", 1);
	tagFile += idIntToHex("id_edit_sched4_endMn", 1);
	tagFile += getMaskFromCheckboxName("sched4Day");

	//Tag validity sched5
	tagFile += idIntToHex("id_edit_sched5_beginHr", 1);
	tagFile += idIntToHex("id_edit_sched5_beginMn", 1);
	tagFile += idIntToHex("id_edit_sched5_endHr", 1);
	tagFile += idIntToHex("id_edit_sched5_endMn", 1);
	tagFile += getMaskFromCheckboxName("sched5Day");

	//Tag validity sched6
	tagFile += idIntToHex("id_edit_sched6_beginHr", 1);
	tagFile += idIntToHex("id_edit_sched6_beginMn", 1);
	tagFile += idIntToHex("id_edit_sched6_endHr", 1);
	tagFile += idIntToHex("id_edit_sched6_endMn", 1);
	tagFile += getMaskFromCheckboxName("sched6Day");


	tagFile += idIntToHex("id_edit_codesiteAuxNb", 1);
	if (document.getElementById("id_edit_codesiteAuxNb").value >= 1) tagFile += idIntToHex("id_edit_codesiteAux1", 4);
	if (document.getElementById("id_edit_codesiteAuxNb").value >= 2) tagFile += idIntToHex("id_edit_codesiteAux2", 4);
	if (document.getElementById("id_edit_codesiteAuxNb").value >= 3) tagFile += idIntToHex("id_edit_codesiteAux3", 4);
	if (document.getElementById("id_edit_codesiteAuxNb").value >= 4) tagFile += idIntToHex("id_edit_codesiteAux4", 4);

	tagFile += '';
	tagFile += '';


	//document.getElementById("id_tagData").innerHTML = tagFile;
	document.getElementById("id_tagData").innerHTML = tagFile;


	//alert('tagFile '+tagFile);
	//;Libra;cmd=write;length=05;data=0112345678;
	var encoderCommand = ";Libra;cmd=write;length=";
	var nbDigits = tagFile.length;
	//01 12345678 
	//000000000000000000004475706f6e74
	//0000000000000000000000004a65616e
	//04d2
	//00
	//00
	//03			
	//var tagFileNbBytes = intToHex(tagFile.length / 2);
	var tagFileNbBytes = intToStrInt(tagFile.length / 2);
	encoderCommand += tagFileNbBytes;
	encoderCommand += ";data=";
	encoderCommand += tagFile
	encoderCommand += ";";
	//copyToClickBoard(encoderCommand)


}