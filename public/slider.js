var counter = 0;
var imgPath, name, who;

if (document.documentElement.clientWidth <= 940) {
	counter = 1;
	document.getElementById('says').removeChild(document.getElementById('says').children[1]);
	function createDiv(message, imgPath, name, who) {
		switch(counter) {
			case 0:
				imgPath = 'designer.jpg';
				name = 'Pavliv Yaroslav';
				who = 'Web designer';
				break

			case 1:
				imgPath = 'Fringe.jpg';
				name = 'John Scott';
				who = 'The Fringe';
				break
		}

		div = document.createElement('div');
		div.className = 'say';
		div.innerHTML = message + '<div class="author"><img src="' + imgPath + '"><span class="text"><b>' + name + '</b> ' + who + '</span></div>';
		div.style.marginRight = '0px';
		says.appendChild(div);
		return div;
	}

	function deleteDiv() {
		document.getElementById('says').removeChild(document.getElementById('says').firstElementChild);
		div.style.right = '0%';
	}

	function animation() {
		var says = document.getElementById('says');
		var fps = 50;
		var right = 0;

		var time = Date.now();
		var x = 0;
		var step;
		var duration = 1440;

		setInterval(function() {
			x += 0.05;
		}, duration / 20);

		var timer = setInterval(function() {
			step = (-1 * (Math.pow(x, 2)) + 1);
			right += step;

			div.style.right = right + '%';
			says.firstElementChild.style.right = right + '%';
			says.firstElementChild.style.opacity = step;
			if (Date.now() - time >= duration) {
				clearInterval(timer);
				deleteDiv();
			}
		}, 1000 / fps);
	}

	setInterval(function() {
		var div = createDiv('Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do  enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse ', imgPath, name, who);
		animation();
		if (counter == 0) {
			counter = 1;
		}

		else {
			counter = 0;
		}
	}, 8000);
}

else {
	function createDiv(message, imgPath, name, who) {
		switch(counter) {
			case 0:
				imgPath = 'designer.jpg';
				name = 'Pavliv Yaroslav';
				who = 'Web designer';
				break

			case 1:
				imgPath = 'Fringe.jpg';
				name = 'John Scott';
				who = 'The Fringe';
				break
		}
		div = document.createElement('div');
		div.className = 'say';
		div.innerHTML = message + '<div class="author"><img src="' + imgPath + '"><span class="text"><b>' + name + '</b> ' + who + '</span></div>';
		div.style.left = '50%';
		div.style.marginRight = '0px';
		div.style.opacity = '0';
		says.appendChild(div);
		return div;
	}

	function deleteDiv() {
		document.getElementById('says').removeChild(document.getElementById('says').children[0]);
		says.children[0].style.right = '0%';
	}

	function startChange() {
		var says = document.getElementById('says');
		var fps = 50;
		var right = 0;
		var left = 50;

		var time = Date.now();
		var x = 0;
		var step;
		var duration = 1470;

		setInterval(function() {
			x += 0.05;
		}, duration / 20);

		var timer = setInterval(function() {
			step = (-1 * (Math.pow(x, 2)) + 1);
			right += step;
			left -= step;

			says.children[0].style.right = right + '%';
			says.children[0].style.opacity = step;
			says.children[1].style.right = right + '%';
			if (Date.now() - time >= duration) {
				says.children[0].style.right = '50%';
				says.children[0].style.opacity = '0';
				says.children[1].style.right = '50%';
				clearInterval(timer);
				deleteDiv();
				var div = createDiv('Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do  enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse ', imgPath, name, who);
				if (counter == 0) {
					counter = 1;
				}

				else {
					counter = 0;
				}
				animationRight();
			}
		}, 1000 / fps);
	}

	function animationRight() {
		var says = document.getElementById('says');
		var fps = 50;
		var left = 50;

		var time = Date.now();
		var x = 0;
		var step;
		var duration = 1470;

		setInterval(function() {
			x += 0.05;
		}, duration / 20);

		var timer = setInterval(function() {
			step = (-1 * (Math.pow(x, 2)) + 1);
			left -= step;

			says.children[1].style.left = left + '%';
			says.children[1].style.opacity = (-1 * step) + 1;
			if (Date.now() - time >= duration) {
				clearInterval(timer);
				says.children[1].style.opacity = '1';
				says.children[1].style.left = null;
			}
		}, 1000 / fps);
		return true;
	}

	setInterval(function() {
		startChange();
	}, 8000);
}