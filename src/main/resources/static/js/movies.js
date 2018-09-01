	const URL_SERVER = "http://localhost:8080";
	const URL_DEV = "http://localhost:8090";
	
	let ServerURL = URL_DEV + "/api";
	
	var repository = [];
	var $ = (id) => document.getElementById(id);
	var $value = (id) => $(id).value;
	var $selected = (id) => $(id).selected;
	var $checkedValue = (id1,id2) => $(id1).checked? $(id1).value : $(id2).value;
	var $checkedValue = (ids) => {
		var checkeds = ids.filter((_id) => $(_id).checked);
		return checkeds.length == 1?$(checkeds[0]).value:"-";
	};
	var movieFromForm = () =>{
		var id = $value("movie.field.id");
		var title = $value("movie.field.title");
		var releasedDate = $value("movie.field.releasedDate");
		var budget = $value("movie.field.budget");
		var poster = $value("movie.field.poster");
		var rating = $value("movie.field.rating");
		var category = $value("movie.field.category");
		var result = $checkedValue(["movie.field.result.winner","movie.field.result.nominee"]);
		return {id: id, title: title, releasedDate: releasedDate, budget: budget, poster: poster, rating: rating, category: category, result: result};
	};
	var clearForm = () =>{
		$("movie.field.id").value=null;
		$("movie.field.title").value=null;
		$("movie.field.releasedDate").value=null;
		$("movie.field.budget").value=null;
		$("movie.field.poster").value=null;
		$("movie.field.rating").value=null;
		$("movie.field.category").value=null;
		$("movie.field.result.nominee").checked=null;
		$("movie.field.result.winner").checked=null;
	};

	var addRowToTable = (movie) => {
		var row = "";
		row += "<tr>";
		row += "<td>"+movie.title+"</td>";
		row += "<td>"+movie.releasedDate+"</td>";
		row += "<td>"+movie.budget+"</td>";
		row += "<td><img";
		row += "	src=\""+movie.poster+"\" ";
		row += "	width=\""+"30px"+"\"></td>";
		row += "<td>"+movie.rating+"</td>";
		row += "<td>"+movie.category+"</td>";
		row += "<td>"+("winner" == movie.result)+"</td>";
		row += "<td><button id=\"btnDelete"+movie.id+"\" data-movie-id=\""+movie.id+"\">"+"delete"+"</button></td>";
		row += "</tr>";
		return row;
	};
	var fieldValueIsRequired = (field, help, label, value) => {
		var result = true;
		if (!value){
			$(field).style.backgroundColor = "red";
			$(help).innerHTML = label+" is required";
			result = false;
		} else {
			$(field).style.backgroundColor = "";
			$(help).innerHTML = "";
		}
		return result;
	};
	var movieIsValid = (movie) => {
		var result = true;
		result &= fieldValueIsRequired("movie.field.title","movie.help.title","movie", movie.title);
		return result;
	};
	var onclickBtnSave = (e) => {
		var movie = movieFromForm();
		if (movieIsValid(movie)){
			if (!movie.id){
				movie.id = new Date().getTime();
			}
			
			doPost(JSON.stringify(movie));
			
			clearForm();
			loadMovies();
		}
	};
	var onclickBtnClear = (e) => clearForm();
	var onclickBtnDelete = (e) => {
		console.log(e.target.dataset);
		//var index = repository.findIndex(_m => _m.id == e.target.dataset.movieId);
		//repository.splice(index,1);
		//localStorage.setItem("movies",JSON.stringify(repository));
		//$("tblBody").innerHTML = "";
		//loadMovies()
	};
	var addRows = () => {
		repository.forEach(_movie => {
			$("tblBody").innerHTML += (addRowToTable(_movie));
		});
	};
	var registerRowEvents = () => {
		repository.forEach(_movie => {
			$("btnDelete"+_movie.id).onclick = onclickBtnDelete;
		});
	};
	var loadMovies = () => {
		doGet((data) => {
			$("tblBody").innerHTML = "";
			repository = data;
			if(repository.length > 0){
				addRows();
				registerRowEvents();
				$("tblcaption").innerText = ""+repository.length+" movies";
			}else{
				$("tblcaption").innerText = "0 movies";
				$("tblBody").innerHTML = "<tr><td colspan='8'>Nenhum filme cadastrado</td></tr>";
			}
		});
	};
	
	var doPost = (data) => {
		let xhr = new XMLHttpRequest();
		xhr.open("POST", ServerURL + "/movies");
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.onload = (result) => console.log(result.target.responseText);
		console.log(data);
		xhr.send(data);
	}
	
	var doGet = (callback) => {
		let xhr = new XMLHttpRequest();
		xhr.open("GET", ServerURL + "/movies");
		xhr.onload = callback;
		xhr.send();
	}
	
	var doRemove = (data) => {
		let xhr = new XMLHttpRequest();
		xhr.open("DELETE", ServerURL + "/movies/" + data.id);
		xhr.onload = (result) => console.log(result);
		xhr.send();
	}
	
	init = () => {
		//localStorage.removeItem("movies");
		document.getElementsByTagName("title").item(0).innerText = "Persistir dados usando localStorage";
		document.getElementsByClassName("pagetitle").item(0).innerText = "Persistir dados usando localStorage";
		$("btnSave").onclick = onclickBtnSave;
		$("btnClear").onclick = onclickBtnClear;
		loadMovies();
	};
	window.onload = init;