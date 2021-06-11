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
	document.getElementById("mobile-menu-toggle").onchange = e => {
		let isChecked = e.target.checked;

		if (isChecked) {
			document.getElementById("mobile-menu-dropdown").classList.add("visible");
		} else {
			document.getElementById("mobile-menu-dropdown").classList.remove("visible");
		}
	}

	document.getElementById("shorten-original-link").oninput = e => {
		e.target.parentElement.classList.remove("shorten-error");
	}

	document.getElementById("shorten-original-link").onchange = e => {
		e.target.parentElement.classList.remove("shorten-error");
	}

	document.getElementById("shorten-form").onsubmit = e => {
		e.preventDefault();
		let input = document.getElementById("shorten-original-link");
		let originalLink = input.value;
		input.value = "";

		if (originalLink === "") {
			input.parentElement.classList.add("shorten-error");
			return;
		} else {
			input.parentElement.classList.remove("shorten-error");
		}

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
				let shortLink = data.result.short_link;
				outputDiv.innerHTML = `
					<p class="shorten-long-link">${originalLink}</p>
					<div>
						<p class="shorten-short-link">${shortLink}</p>
						<button class="btn" data-url="${shortLink}" onclick="copyFunc(this)"></button>
					</div>
				`;
			})
			.catch(() => {
				alert("shorten-error: We were unable to shorten your link");
				console.log(shorten - error);
			});
	};
};
