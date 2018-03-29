if ('matchMedia' in window && Array.prototype.forEach && 'querySelector' in document && ('AudioContext' in window || 'webkitAudioContext' in window) && navigator.mediaDevices.getUserMedia && typeof MediaRecorder === 'function') {
	// set up basic variables for app
	var record = document.querySelector('.record');
	var soundClips = document.querySelector('#sound-clips');
	var canvas = document.querySelector('.visualizer');
	var mainSection = document.querySelector('.main-controls');

	// JS RESETS
	document.querySelectorAll('.no-js').forEach( function(clip){
		clip.remove();
	})
	document.querySelector('#buttons').style.display = "block";
	document.querySelector('#sound-clips-visualized').style.display = "block";

	// visualiser setup - create web audio api context and canvas
	var audioCtx = new (window.AudioContext || webkitAudioContext)();
	
	//Canvas has support from IE8
	var canvasCtx = canvas.getContext("2d");

	console.log('getUserMedia supported.');

	var constraints = { audio: true };
	var chunks = [];

	var onSuccess = function (stream) {
		var mediaRecorder = new MediaRecorder(stream);

		//Creates the canvas line
		visualize(stream);

		// Starts recording
		record.onmousedown = function () {
			console.log('recording');
			mediaRecorder.start();
		}
		record.ontouchstart = function () {
			console.log('recording');
			mediaRecorder.start();
		}

		record.addEventListener("keydown", function (event) {
			if (event.keyCode === 13 || event.keyCode === 32) {
				console.log('recording');
				mediaRecorder.start();
			}
		});


		// Stops recording
		record.onmouseup = function () {
			console.log('recording stops');
			mediaRecorder.stop();
			record.style.color = "";
			record.disabled = false;
		}

		// Stops recording
		record.ontouchend = function () {
			console.log('recording stops');
			mediaRecorder.stop();
			record.style.color = "";
			record.disabled = false;
		}

		record.addEventListener("keyup", function (event) {
			if (event.keyCode === 13 || event.keyCode === 32) {
				console.log('recording stops');
				mediaRecorder.stop();
				record.style.color = "";
				record.disabled = false;
			}
		});


		// When user stops recording
		mediaRecorder.onstop = function (e) {
			var clipName = prompt('Enter a name for your sound clip?', 'My unnamed clip');

			var blob = new Blob(chunks, { 'type': 'audio/ogg; codecs=opus' });
			chunks = [];
			var audioURL = window.URL.createObjectURL(blob);

			console.log("recorder stopped");

			soundClips.insertAdjacentHTML('beforeend', '<article class="clip" id="'+clipName+'"><h2>'+clipName+'</h2><label for="repeat">Repeat every ...ms<input id="repeat" value="0" type="number" step="100"></label><label for="delay">Delay for ...ms<input id="delay" value="0" type="number" step="100"></label><audio controls="" src="'+audioURL+'"></audio><div><button class="addToLoop">Add to loop</button></div></article>');
			var addLoopButton = document.querySelectorAll('.addToLoop');
			addLoopButton.forEach(function (button) {
				button.onclick = function (e) {
					evtTgt = e.target;
					addToLoop(evtTgt.parentNode.parentNode);
					createSoundOverview();
				}
			})

		}

		var addAllToLoop = document.querySelector('#addAllToLoop');
		addAllToLoop.onclick = function () {
			// Repeat every 10s
			// setInterval(firstPlay, 10000);
			function firstPlay() {
				document.querySelectorAll('.clip').forEach(function (clip) {
					addToLoop(clip, false)
				})
			}
			firstPlay()
			//Stop every 9.999s
			createSoundOverview();
			event.target.style.opacity = "0";
		}

		mediaRecorder.ondataavailable = function (e) {
			chunks.push(e.data);
		}
	}

	var onError = function (err) {
		console.log('The following error occured: ' + err);
	}

	//Check for devices and microphones, then fire onSuccess
	navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);

	function addToLoop(element, stop) {
		var myAudio = new Audio(element.querySelector('audio').src);

		if (element.querySelector('#repeat').value > 0) {
			var repeat = element.querySelector('#repeat').value;
			if (element.querySelector('#delay').value > 0) {
				var delay = element.querySelector('#delay').value;
				//Set loop start delay
				setTimeout(
					//Set loop repeat delay
					setInterval(function () {
						myAudio.play()
					}, repeat)
					, delay)
			}
			//Set loop repeat delay
			else {
				setInterval(function () {
					myAudio.play()
				}, repeat)
			}
		}
		// constant loop
		else {
			myAudio.addEventListener('ended', function () {
				this.currentTime = 0;
				this.play();
			}, false);
			myAudio.play()
		}
		if (stop) {
			myAudio.pause()
		}

	}

	function visualize(stream) {
		var source = audioCtx.createMediaStreamSource(stream);

		var analyser = audioCtx.createAnalyser();
		analyser.fftSize = 2048;
		var bufferLength = analyser.frequencyBinCount;
		var dataArray = new Uint8Array(bufferLength);

		source.connect(analyser);
		//analyser.connect(audioCtx.destination);

		draw()

		function draw() {
			WIDTH = canvas.width
			HEIGHT = canvas.height;

			requestAnimationFrame(draw);

			analyser.getByteTimeDomainData(dataArray);

			canvasCtx.fillStyle = 'rgb(255, 255, 255)';
			canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

			canvasCtx.lineWidth = 5;
			canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

			canvasCtx.beginPath();

			var sliceWidth = WIDTH * 1.0 / bufferLength;
			var x = 0;


			for (var i = 0; i < bufferLength; i++) {

				var v = dataArray[i] / 128.0;
				var y = v * HEIGHT / 2;

				if (i === 0) {
					canvasCtx.moveTo(x, y);
				} else {
					canvasCtx.lineTo(x, y);
				}

				x += sliceWidth;
			}

			canvasCtx.lineTo(canvas.width, canvas.height / 2);
			canvasCtx.stroke();

		}
	}

	window.onresize = function () {
		canvas.width = mainSection.offsetWidth;
	}

	window.onresize();

	function createSoundOverview() {

		var overview = document.querySelector('#sound-clips-visualized');
		var overviewWidth = overview.getBoundingClientRect().width;
		var overviewHeight = overview.getBoundingClientRect().height;
		var sounds = document.querySelectorAll('.clip');
		var colors = ['1abc9c', '2ecc71', '3498db', '9b59b6', '34495e', 'f1c40f']

		//New container for every sound
		sounds.forEach(function (sound, fEIndex) {
			var soundName = sound.querySelector('h2').textContent;
			//Add container for every second in loop
			var container = document.createElement('div');
			container.setAttribute('class', 'second-container');
			container.style.height = overviewHeight / sounds.length + "px";
			container.style.top = (overviewHeight / sounds.length) * fEIndex + "px";

			var containerTitle = document.createElement('h2');
			containerTitle.textContent = soundName;
			containerTitle.setAttribute('class', 'second-container-title');
			container.appendChild(containerTitle);

			for (var j = 0; j < 10; j++) {
				// add every second as block to container
				var secondBlock = document.createElement('div');
				secondBlock.setAttribute('class', 'second-block');
				secondBlock.innerHTML = j;
				container.appendChild(secondBlock);
				overview.appendChild(container);
			}

			var soundContainer = document.createElement('div');
			var duration = Number(sound.querySelector('audio').duration);
			var repeat = Number(sound.querySelector('#repeat').value);
			var delay = Number(sound.querySelector('#delay').value);

			if (duration === Infinity) {
				duration = 1000;
			}
			else {
				duration *= 1000;
			}

			// Create all the sound elements
			var amountOfSoundBlocks = Math.floor((10000 - delay) / (duration + repeat));
			console.log(delay, duration, repeat);
			console.log( `Math.floor((10000 - ${delay}) / (${duration} + ${repeat}))` );
			console.log(amountOfSoundBlocks);
			var randomColor = colors[Math.floor(Math.random() * colors.length)];
			colors.pop(randomColor);

			for (var k = 0; k < amountOfSoundBlocks; k++) {
				var soundBlock = document.createElement('div');
				soundBlock.setAttribute('class', 'sound-block');
				// Container width / timeline duration * sound duration
				soundBlock.style.width = Math.floor((overviewWidth / amountOfSoundBlocks)) + 'px';
				soundBlock.style.backgroundColor = '#' + randomColor;
				soundBlock.style.marginLeft = Math.floor((overviewWidth / 10000) * repeat) + 'px';
				soundContainer.appendChild(soundBlock);
			}
			soundContainer.setAttribute('class', 'second-container visual-sound');
			soundContainer.style.height = overviewHeight / sounds.length + "px";
			soundContainer.style.top = (overviewHeight / sounds.length) * fEIndex + "px";
			soundContainer.style.paddingLeft = Math.floor((overviewWidth / 10000) * delay) + 'px';

			overview.appendChild(soundContainer);
		})
	}

	function loopTimeIndicator() {
		var overview = document.querySelector('#sound-clips-visualized');
		var overviewWidth = overview.getBoundingClientRect().width;
		var indicator = document.querySelector('#loopTimeIndicator');
		indicator.style = 'transition: transform 0s linear; transform: translateX(0);';
		indicator.getBoundingClientRect();
		indicator.style = 'transform: translateX(' + overviewWidth + 'px); transition: transform 10s linear;'
	}
	setInterval(loopTimeIndicator, 10000);
} else {
	fallback();
}

function fallback(){
	console.log('fallback');
	console.log('getUserMedia not supported on your browser!');
	var buttons = document.getElementById('buttons')
	var soundClipsVisual = document.getElementById('sound-clips-visualized')
	var soundClips = document.getElementById('sound-clips');
	buttons.style.display = "none";
	soundClipsVisual.style.display = "none";
	soundClips.style.marginLeft = "1em";
	soundClips.children.style.top = "1em";
}