
const SHORTENED_LINKS_COOKIE_NAME = "shortend-links";

function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	var expires = "expires=" + d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

function copyFunc(e) {
	e.classList.add("shorten-copied");
	var tempInput = document.createElement("input");
	tempInput.value = e.getAttribute("data-url");
	document.body.appendChild(tempInput);
	tempInput.select();
	document.execCommand("copy");
	document.body.removeChild(tempInput);
}

window.onload = () => {
	// Menu toggle
	document.getElementById("mobile-menu-toggle").onchange = e => {
		let isChecked = e.target.checked;

		if (isChecked) {
			document.getElementById("mobile-menu-dropdown").classList.add("visible");
		} else {
			document.getElementById("mobile-menu-dropdown").classList.remove("visible");
		}
	}

	// Load previously shortened links from cookie
	let cookieValue = getCookie(SHORTENED_LINKS_COOKIE_NAME);
	let shortenedLinks = (cookieValue === "") ? [] : JSON.parse(cookieValue);

	for (let i = 0; i < shortenedLinks.length; i++) {
		const {
			originalLink,
			shortLink,
		} = shortenedLinks[i];

		let outputDiv = document.createElement("div");
		outputDiv.classList.add("shorten-output");
		outputDiv.innerHTML = `
			<p class="shorten-long-link">${originalLink}</p>
			<div>
				<p class="shorten-short-link">${shortLink}</p>
				<button class="btn" data-url="${shortLink}" onclick="copyFunc(this)"></button>
			</div>
		`;
		document.getElementById("shorten-outputs").prepend(outputDiv);				
	}

	document.getElementById("shorten-form").onsubmit = e => {
		e.preventDefault();
		let input = document.getElementById("shorten-original-link");
		let originalLink = input.value;
		input.value = "";

		// Check if the input is empty
		if (originalLink === "") {
			input.parentElement.classList.add("shorten-error");
			return;
		} else {
			input.parentElement.classList.remove("shorten-error");
		}

		// Creating loading div
		let outputDiv = document.createElement("div");
		outputDiv.classList.add("shorten-output");
		outputDiv.innerHTML = `
			<p class="shorten-generating">Generating...</p>
		`;
		document.getElementById("shorten-outputs").prepend(outputDiv);

		fetch(`https://api.shrtco.de/v2/shorten?url=${originalLink}`, {
			method: 'POST',
			headers: {},
		})
			.then(response => response.json())
			.then(data => {
				// Update output div
				let shortLink = data.result.short_link;
				outputDiv.innerHTML = `
					<p class="shorten-long-link">${originalLink}</p>
					<div>
						<p class="shorten-short-link">${shortLink}</p>
						<button class="btn" data-url="${shortLink}" onclick="copyFunc(this)"></button>
					</div>
				`;

				// Save to cookie
				shortenedLinks.push({
					originalLink,
					shortLink,
				});

				setCookie(SHORTENED_LINKS_COOKIE_NAME, JSON.stringify(shortenedLinks), 365);
			})
			.catch(error => {
				alert("Error: We were unable to shorten your link");
				console.log(error);
				document.getElementById("shorten-outputs").removeChild(outputDiv);
			});
	};

	document.getElementById("shorten-original-link").oninput = e => {
		e.target.parentElement.classList.remove("shorten-error");
	}

	document.getElementById("shorten-original-link").onchange = e => {
		e.target.parentElement.classList.remove("shorten-error");
	}
};
