var my = {};

var g_startOffset = null;
var g_selectedPiece = null;
var moveNumber = 1;

var g_allMoves = [];
var g_playerWhite = true;
var g_changingFen = false;
var g_analyzing = false;

var g_uiBoard;
var g_cellSize = 64; //48

//*** http://localhost:81/mathsisfun/test/garbochess.html

// http://localhost:81/mathsisfun/test/ichess.html

// some code also in chessai.rp

// http://www.mathsisfun.com/games/images/checkersrp.js

// garbochess: http://forwardcoding.com/projects/chess/chess.html  
// and http://forwardcoding.com/projects/ajaxchess/chess.html
// FEN: https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation
// SAN: https://en.wikipedia.org/wiki/Algebraic_notation_(chess)

// TODO:
// flip board (white at top)
// allow white to be computer

function chessrpMain() {
	my.version = '0.821';
	w = 512; //400
	h = 512;
	wd = g_cellSize;
	my.dragQ = false;

	my.players = [
		{
			name: 'White',
			clr: 'white',
			typ: 0, // 0 = user, 1 = comp easy, etc
			style: 'drop-shadow(2px 2px 5px #88f) drop-shadow(-2px -2px 5px #88f)'
		},
		{
			name: 'Black',
			clr: 'black',
			typ: 1,
			style: 'drop-shadow(2px 2px 5px #f88) drop-shadow(-2px -2px 5px #f88)'
		}
	];


	var s = "";
	//s += '<div>';
	s += '<audio id="sndmove" src="/sounds/move.mp3" preload="auto"></audio>'
	s += '<audio id="sndtake" src="/sounds/capture.mp3" preload="auto"></audio>'

	s += '<div id="main" style="position:relative; width:' + w + 'px; min-height:' + (h + 150) + 'px; border: none;  background-color: white; margin:auto; display:block;">';

	s += '<div style="margin: 5px;">';
	s += '<button id="newBtn" type="button" style="z-index:2;" class="clickbtn"  onclick="optpop()">New Game</button>';
	s += ' ';
	s += '<button id="newBtn" type="button" style="z-index:2;" class="clickbtn"  onclick="UIUndoMove()">Undo</button>';
	s += ' ';
	my.soundQ = true
	s += soundBtnHTML()
	s += ' &nbsp; &nbsp; <span id="msg" style="font: bold 22px Arial; color: red;">&nbsp;</span>';


	if (false) { // flip borad (white at top)
		s += '<select onchange="javascript:UIChangeStartPlayer()">';
		s += '<option value="white">White</option>';
		s += '<option value="black">Black</option>';
		s += '</select>';
	}
	if (false) { // time per move
		s += 'Time per move: <input id="TimePerMove" value="3000" style="width: 50px;" onchange="javascript:UIChangeTimePerMove()" />ms';
	}
	//s += '<a href="javascript:UIUndoMove()">Undo</a>';

	s += '</div>';

	s += '<div style="margin-top:5px;">';

	var sz = wd * 8;
	s += '<div style="position: relative; width:' + sz + 'px; height:' + sz + 'px; ">';
	s += '<div id="board" style="position: relative; top: 0;"></div> ';
	s += '<div id="mouser" style="position: absolute; top: 0; width:' + sz + 'px; height:' + sz + 'px;"></div> ';
	s += '<div id="drag" style="position:absolute; pointer-events: none; ">';
	s += '</div>';

	s += optPopHTML();

	s += '<br/>';
	s += '<textarea style="width:' + sz + 'px; height: 100px; " id="PgnTextBox"></textarea>';
	s += '<br/>';
	if (false) { // Analysis
		s += '<div>';
		s += '<a id="AnalysisToggleLink" href="UIAnalyzeToggle()">Analysis: Off</a>';
		s += '</div>';
	}

	// NB invisible: hidden visible
	s += '<span id="output" style="visibility: hidden;"></span>';
	s += '<br/>';

	// NB invisible:
	s += '<input id="FenTextBox" style="width: 400px; visibility: hidden;" onchange="UIChangeFEN()"/>';

	s += '</div>';

	s += '</div>';

	s += '<div id="copyrt" style="position:relative; text-align:center;font: 10px Arial; color: #aaa;">&copy; 2017 MathsIsFun.com  v' + my.version + '</div>';
	s += '</div>';
	document.write(s);
	
	soundToggle()

	el = document.getElementById('mouser');
	el.addEventListener("mousedown", onMouseDown, false);
	el.addEventListener('touchstart', ontouchstart, false);

	optpop();
	//newGame();
}

function newGame() {

	// player type

	for (var i = 0; i < my.players.length; i++) {
		var p = my.players[i];
		var div = document.getElementById("playerType" + i);
		p.typ = div.selectedIndex;
		console.log("my.players", my.players[i]);
	}

	moveNumber = 1;

	var pgnTextBox = document.getElementById("PgnTextBox");
	pgnTextBox.value = "";

	var div = document.getElementById("msg");
	div.innerHTML = '';

	EnsureAnalysisStopped();
	ResetGame();
	if (InitializeBackgroundEngine()) {
		g_backgroundEngine.postMessage("go");
	}
	g_allMoves = [];
	RedrawBoard();

	//el.addEventListener('touchstart', ontouchstart, false);
	//el.addEventListener("mousemove", dopointer, false);

	my.randCount = 1;

	if (!g_playerWhite) {
		SearchAndRedraw();
	}
}

function ontouchstart(evt) {
	console.log("ontouchstart", evt);
	var touch = evt.targetTouches[0];
	evt.clientX = touch.clientX;
	evt.clientY = touch.clientY;
	evt.touchQ = true;
	evt.preventDefault();

	onMouseDown(evt)
}

function ontouchmove(evt) {
	//Assume only one touch/only process one touch even if there's more
	var touch = evt.targetTouches[0];
	evt.clientX = touch.clientX;
	evt.clientY = touch.clientY;
	evt.touchQ = true;
	//evt.preventDefault();
	onMouseMove(evt);

}

function ontouchend(evt) {
	console.log("ontouchend");
	el.addEventListener('touchstart', ontouchstart, false);
	window.removeEventListener("touchend", ontouchend, false);

	if (my.dragQ) {
		my.dragQ = false;
		var bRect = el.getBoundingClientRect();
		var mouseX = (evt.changedTouches[0].clientX - bRect.left);
		var mouseY = (evt.changedTouches[0].clientY - bRect.top);
		console.log("ontouchend", evt, mouseX, mouseY);
		pcDrop(mouseX, mouseY);
		window.removeEventListener("touchmove", ontouchmove, false);
	}

}

function onMouseDown(evt) {

	var bRect = el.getBoundingClientRect();
	var mouseX = (evt.clientX - bRect.left);
	var mouseY = (evt.clientY - bRect.top);

	my.startX = Math.floor(mouseX / g_cellSize);
	my.startY = Math.floor(mouseY / g_cellSize);
	// spot to hold dragged piece (or could just center it on mouse cursor)
	my.dragHoldX = mouseX - (my.startX * g_cellSize);
	my.dragHoldY = mouseY - (my.startY * g_cellSize);

	// find piece, see if valid moves

	var piece = g_board[((my.startY + 2) * 0x10) + (g_playerWhite ? my.startX : 7 - my.startX) + 4];

	var moves = GenerateValidMoves();
	var okMoves = [];
	for (var i = 0; i < moves.length; i++) {
		if ((moves[i] & 0xFF) == MakeSquare(my.startY, my.startX)) {
			okMoves.push(moves[i]);
		}
	}

	if (okMoves.length > 0) {
		my.dragQ = true;

		my.dragDiv = document.getElementById('drag');
		my.dragDiv.innerHTML = '<img src="' + pcName(piece) + '" style="width:45px;">';
		my.dragDiv.style.left = (mouseX - my.dragHoldX) + 'px';
		my.dragDiv.style.top = (mouseY - my.dragHoldY) + 'px';
		my.dragDiv.style.visibility = 'visible';

		hilite(); // clear all hiliting (from previous player)

		for (i = 0; i < okMoves.length; i++) {
			var move = okMoves[i];

			td = move2td(move, false);
			//td.style.boxShadow = 'inset 0px 0px 15px #fff';
			hilite(td, '#eee');

			if (i == 0) {
				var td = move2td(move, true);
				//td.style.backgroundImage = null;
				// remove image from source square
				while (td.firstChild) {
					td.removeChild(td.firstChild);
				}
				//td.style.backgroundColor = '#fff';
			}
		}

		if (evt.touchQ) {
			console.log("touchq");
			//el.removeEventListener("touchstart", ontouchstart, false);
			//el.removeEventListener("touchmove", ontouchmove, false);
			window.addEventListener("touchmove", ontouchmove, false);
			window.addEventListener("touchend", ontouchend, false);
		} else {
			//el.removeEventListener("mousedown", mouseDownListener, false);
			window.addEventListener("mousemove", onMouseMove, false);
			window.addEventListener("mouseup", onMouseUp, false);
			//window.addEventListener("mouseup", onMouseUp, false);
		}

	}

}

function onMouseMove(evt) {

	if (!my.dragQ) return;

	//getting mouse position correctly
	var bRect = el.getBoundingClientRect();
	var mouseX = (evt.clientX - bRect.left);
	var mouseY = (evt.clientY - bRect.top);
	//console.log("onMouseMove", bRect, mouseX, mouseY);

	my.dragDiv.style.left = (mouseX - my.dragHoldX) + 'px';
	my.dragDiv.style.top = (mouseY - my.dragHoldY) + 'px';
}

function onMouseUp(evt) {

	var bRect = el.getBoundingClientRect();
	var mouseX = (evt.clientX - bRect.left);
	var mouseY = (evt.clientY - bRect.top);

	window.removeEventListener("mousemove", onMouseUp, false);
	window.removeEventListener("mouseup", onMouseUp, false);

	if (my.dragQ) {
		my.dragQ = false;
		pcDrop(mouseX, mouseY);
		window.removeEventListener("mousemove", onMouseMove, false);
		//		document.getElementById("angA").focus(); // this sets focus on iframe for keyboard events
	}
}

function pcDrop(mouseX, mouseY) {
	console.log('pcDrop')
	if (my.soundQ) {
soundStopAll()
		document.getElementById('sndmove').play();
	}
	my.dragDiv.style.visibility = 'hidden';

	my.endX = Math.floor(mouseX / g_cellSize);
	my.endY = Math.floor(mouseY / g_cellSize);
	my.dragQ = false;

	if (!g_playerWhite) {
		my.startY = 7 - my.startY;
		my.endY = 7 - my.endY;
		my.startX = 7 - my.startX;
		my.endX = 7 - my.endX;
	}

	var moves = GenerateValidMoves();
	var move = null;
	for (var i = 0; i < moves.length; i++) {
		if ((moves[i] & 0xFF) == MakeSquare(my.startY, my.startX) &&
			((moves[i] >> 8) & 0xFF) == MakeSquare(my.endY, my.endX)) {
			move = moves[i];
		}
	}

	if (!g_playerWhite) {
		my.startY = 7 - my.startY;
		my.endY = 7 - my.endY;
		my.startX = 7 - my.startX;
		my.endX = 7 - my.endX;
	}

	//		g_selectedPiece.style.left = 0;
	//		g_selectedPiece.style.top = 0;

	if (!(my.startX == my.endX && my.startY == my.endY) && move != null) {

		// computer move
		var typ = my.players[1].typ;
		console.log("************* computer move", g_playerWhite, typ);

		if (typ == 0) {
			// human
			console.log("************* do we ever get here?????????");
			UpdatePgnTextBox(move);
			g_allMoves[g_allMoves.length] = move;
			MakeMove(move);
			RedrawPieces();

		} else {

			UpdatePgnTextBox(move);

			if (InitializeBackgroundEngine()) {
				g_backgroundEngine.postMessage('move ' + FormatMove(move));
			}

			g_allMoves[g_allMoves.length] = move;
			MakeMove(move);

			UpdateFromMove(move);

			//			g_selectedPiece.style.backgroundImage = null;
			//			g_selectedPiece = null;

			var fen = GetFen();
			document.getElementById("FenTextBox").value = fen;

			setTimeout("SearchAndRedraw()", 300);

		}

	} else {

		RedrawPieces();
		//			g_selectedPiece.style.backgroundImage = null;
		//			g_selectedPiece = null;		}
	}

	hilite();

}

function setTime(ms) {
	my.timeout = ms;
}

function hilite(td, clr) {
	if (td == null) {
		// remove all hiliting
		for (y = 0; y < 8; ++y) {
			for (x = 0; x < 8; ++x) {
				var td = g_uiBoard[y * 8 + x];
				td.style.boxShadow = '';
			}
		}

	} else {

		var inset = 'inset 0px 0px 18px ' + clr;
		td.style.boxShadow = inset + ', ' + inset; // twice

		//		console.log("td backgroundColor", getComputedStyle(td).backgroundColor);
		//		if (getComputedStyle(td).backgroundColor == "rgb(255, 206, 158)") {
		//			td.style.boxShadow = 'inset 0px 0px 18px #eee, inset 0px 0px 28px #eee';
		//		} else {
		//			td.style.boxShadow = 'inset 0px 0px 18px #eee, inset 0px 0px 18px #eee, inset 0px 0px 38px #eee'; // dark
		//		}
	}

}

function move2td(move, fromQ) {

	var n = fromQ ? move & 0xFF : (move >> 8) & 0xFF;
	var row = ((n - 36) / 16) << 0;
	var col = (n - 4) % 16;

	var td = g_uiBoard[row * 8 + col];
	return td;
}

function optPopHTML() {
	var s = '';
	s += '<div id="optpop" style="position:absolute; left:-500px; top:-40px; width:360px; padding: 5px; border-radius: 9px; background-color: #bcd; box-shadow: 10px 10px 5px 0px rgba(40,40,40,0.75); transition: all linear 0.3s; opacity:0; text-align: center; ">';

	s += '<div id="optInside" style="margin: 5px auto 5px auto;">';
	for (var i = 0; i < my.players.length; i++) {
		var p = my.players[i];

		//		var chosen = 0;
		//		if (i == 0) chosen = 2;
		s += '<div style="font: 15px Verdana; color:white; background-color: blue; padding: 0 0 15px 0; border-radius: 10px;  border: 3px 3px 3px 3px;">';
		s += '<p>' + p.name + ' player:</p>';
		s += 'Type: ';
		if (i == 0) {
			s += getDropdownHTML(['Human'], 'funcy', 'playerType' + i, p.typ);
		} else {
			s += getDropdownHTML(['Human', 'Computer (Beginner)', 'Computer (Medium)', 'Computer (Challenging)', 'Computer (Hard)'], 'funcy', 'playerType' + i, p.typ);
		}

		s += '</div>';

		//s += i;
	}

	s += '</div>';
	//for (var i = 0; i < tanks.length; i++) {
	//	var t = tanks[i];
	//	s += i;
	//	//s += '<button onclick="optChoose(' + i + ')" style="z-index:2; font: 14px Arial;" class="togglebtn" >' + gm[1][0] + '</button>';
	//}

	s += '<div style="float:right; margin: 0 0 5px 10px;">';
	s += '<button id="optYes" onclick="optYes()" style="z-index:2; font: 22px Arial;" class="togglebtn" >&#x2714;</button>';
	s += '<button onclick="optNo()" style="z-index:2; font: 22px Arial;" class="togglebtn" >&#x2718;</button>';
	s += '</div>';
	s += '</div>';
	return s;
}

function getDropdownHTML(opts, funcName, id, chkNo) {

	var s = '';
	//s += '<select id="' + id + '" onclick="' + funcName + '" style="font: 14px Arial; color: #6600cc; background: rgba(200,220,256,0.7); padding: 1px;line-height:30px;">';
	s += '<select id="' + id + '" style="font: 14px Arial; color: #6600cc; background: white; padding: 1px;line-height:30px; border-radius: 5px;">';
	for (var i = 0; i < opts.length; i++) {
		var idStr = id + i;
		var chkStr = i == chkNo ? 'selected' : '';

		s += '<option id="' + idStr + '" value="' + opts[i] + '" style="height:21px;" ' + chkStr + ' >' + opts[i] + '</option>';
	}
	s += '</select>';
	//console.log("getDropdownHTML", s);
	return s;
}

function optpop() {
	//	console.log("optpop");
	var pop = document.getElementById('optpop');
	pop.style.transitionDuration = "0.3s";
	pop.style.opacity = 1;
	pop.style.zIndex = 12;
	pop.style.left = (w - 400) / 2 + 'px';

}

function optYes() {
	var pop = document.getElementById('optpop');
	pop.style.opacity = 0;
	pop.style.zIndex = 1;
	pop.style.left = '-999px';

	newGame();
}

function optNo() {
	var pop = document.getElementById('optpop');
	pop.style.opacity = 0;
	pop.style.zIndex = 1;
	pop.style.left = '-999px';
}

function EnsureAnalysisStopped() {
	if (g_analyzing && g_backgroundEngine != null) {
		g_backgroundEngine.terminate();
		g_backgroundEngine = null;
	}
}

function UIAnalyzeToggle() {
	if (InitializeBackgroundEngine()) {
		if (!g_analyzing) {
			g_backgroundEngine.postMessage("analyze");
		} else {
			EnsureAnalysisStopped();
		}
		g_analyzing = !g_analyzing;
		document.getElementById("AnalysisToggleLink").innerText = g_analyzing ? "Analysis: On" : "Analysis: Off";
	} else {
		alert("Your browser must support web workers for analysis - (chrome4, ff4, safari)");
	}
}

function UIChangeFEN() {
	if (!g_changingFen) {
		var fenTextBox = document.getElementById("FenTextBox");
		var result = InitializeFromFen(fenTextBox.value);
		if (result.length != 0) {
			UpdatePVDisplay(result);
			return;
		} else {
			UpdatePVDisplay('');
		}
		g_allMoves = [];

		EnsureAnalysisStopped();
		InitializeBackgroundEngine();

		g_playerWhite = !!g_toMove;
		g_backgroundEngine.postMessage("position " + GetFen());

		RedrawBoard();
	}
}

function UIChangeStartPlayer() {
	g_playerWhite = !g_playerWhite;
	RedrawBoard();
}

function UpdatePgnTextBox(move) {
	var pgnTextBox = document.getElementById("PgnTextBox");
	if (g_toMove != 0) {
		if (pgnTextBox.value.length > 0) pgnTextBox.value += ' ';
		pgnTextBox.value += moveNumber + ". ";
		moveNumber++;
	}
	pgnTextBox.value += GetMoveSAN(move) + " ";

	var mv = GetMoveSAN(move);
	var msg = '';
	if (mv.charAt(mv.length - 1) == '+') msg = 'Check';
	if (mv.charAt(mv.length - 1) == '#') msg = 'CheckMate!';
	
	if (mv.indexOf('x') > 0) {
		if (my.soundQ) {
soundStopAll();
			document.getElementById('sndtake').play();
		}
		
	}
	
	var div = document.getElementById("msg");
	div.innerHTML = msg;

}

function UIChangeTimePerMove() {
	var timePerMove = document.getElementById("TimePerMove");
	g_timeout = parseInt(timePerMove.value, 10);
}

function FinishMove(bestMove, value, timeTaken, ply) {
	if (bestMove != null) {
		UIPlayMove(bestMove, BuildPVMessage(bestMove, value, timeTaken, ply));
	} else {
		alert("Checkmate!");
	}
}

function UIPlayMove(move, pv) {
	UpdatePgnTextBox(move);

	g_allMoves[g_allMoves.length] = move;
	MakeMove(move);

	UpdatePVDisplay(pv);

	UpdateFromMove(move);

	// hilite move
	td = move2td(move, false);
	hilite(td, '#dd0');
	td = move2td(move, true);
	hilite(td, 'green');

}

function UIUndoMove() {
	if (g_allMoves.length == 0) {
		return;
	}

	if (g_backgroundEngine != null) {
		g_backgroundEngine.terminate();
		g_backgroundEngine = null;
	}

	UnmakeMove(g_allMoves[g_allMoves.length - 1]);
	g_allMoves.pop();

	if (g_playerWhite != !!g_toMove && g_allMoves.length != 0) {
		UnmakeMove(g_allMoves[g_allMoves.length - 1]);
		g_allMoves.pop();
	}

	RedrawBoard();
}

function UpdatePVDisplay(pv) {
	if (pv != null) {
		var outputDiv = document.getElementById("output");
		if (outputDiv.firstChild != null) {
			outputDiv.removeChild(outputDiv.firstChild);
		}
		outputDiv.appendChild(document.createTextNode(pv));
	}
}

function SearchAndRedraw() {
	if (my.soundQ) {
	soundStopAll()
		document.getElementById('sndmove').play();
	}
	
	if (g_analyzing) {
		EnsureAnalysisStopped();
		InitializeBackgroundEngine();
		g_backgroundEngine.postMessage("position " + GetFen());
		g_backgroundEngine.postMessage("analyze");
		return;
	}

	var typ = my.players[1].typ;
	var maxPly = 1;
	var rand = 'n';
	switch (my.players[1].typ) {
		case 1:

			var prevRate = my.randCount / moveNumber;
			console.log("Random?", moveNumber, my.randCount, prevRate);
			if (prevRate > 0.3) {
				rand = 'n';
			} else {
				if (prevRate < 0.1) {
					rand = 'y';
				} else {
					if (Math.random() < 0.2) {
						rand = 'y';
					}
				}
			}
			if (rand == 'y') my.randCount++;

			maxPly = 1; // used in garbochess.js
			g_timeout = 40;
			break;
		case 2:
			maxPly = getRandomInt(1, 3);
			g_timeout = 100;
			break;
		case 3:
			maxPly = getRandomInt(2, 5);
			g_timeout = 500;
			break;
		case 4:
			maxPly = 99;
			g_timeout = 2000;
			break;
	}

	if (InitializeBackgroundEngine()) {
		//rp_ply = maxPly;

		g_backgroundEngine.postMessage("search " + g_timeout + ' ' + maxPly + ' ' + rand);
	} else {
		//Search(FinishMove, 99, null);
		Search(FinishMove, 2, null);
	}
}

function plyDone(bestMove, value, timeTaken, ply) {

	console.log("plyDone", bestMove, value, timeTaken, ply);

}

var g_backgroundEngineValid = true;
var g_backgroundEngine;

function InitializeBackgroundEngine() {
	if (!g_backgroundEngineValid) {
		return false;
	}

	if (g_backgroundEngine == null) {
		g_backgroundEngineValid = true;
		try {
			g_backgroundEngine = new Worker("images/garbochess.js");
			g_backgroundEngine.onmessage = function (e) {
				if (e.data.match("^pv") == "pv") {
					UpdatePVDisplay(e.data.substr(3, e.data.length - 3));
				} else if (e.data.match("^message") == "message") {
					EnsureAnalysisStopped();
					UpdatePVDisplay(e.data.substr(8, e.data.length - 8));
				} else {

					//console.log("*** g_backgroundEngine.onmessage", e.data);

					UIPlayMove(GetMoveFromString(e.data), null);
				}
			}
			g_backgroundEngine.error = function (e) {
				console.log("Error from background worker:" + e.message);
			}
			g_backgroundEngine.postMessage("position " + GetFen());
		} catch (error) {
			g_backgroundEngineValid = false;
		}
	}

	return g_backgroundEngineValid;
}

function UpdateFromMove(move) {
	var fromX = (move & 0xF) - 4;
	var fromY = ((move >> 4) & 0xF) - 2;
	var toX = ((move >> 8) & 0xF) - 4;
	var toY = ((move >> 12) & 0xF) - 2;

	if (!g_playerWhite) {
		fromY = 7 - fromY;
		toY = 7 - toY;
		fromX = 7 - fromX;
		toX = 7 - toX;
	}

	if ((move & moveflagCastleKing) ||
		(move & moveflagCastleQueen) ||
		(move & moveflagEPC) ||
		(move & moveflagPromotion)) {
		RedrawPieces();
	} else {
		var fromSquare = g_uiBoard[fromY * 8 + fromX];
		//		$(g_uiBoard[toY * 8 + toX])
		//			.empty()
		//			.append($(fromSquare).children());
		var toDiv = g_uiBoard[toY * 8 + toX];
		toDiv.innerHTML = '';
		//if (fromSquare.hasChildNodes) toDiv.appendChild(fromSquare.children[0]);
		RedrawPieces();
	}
}

function pcName(piece) {

	var pcTyp = null;
	switch (piece & 0x7) {
		case piecePawn:
			pcTyp = 'p';
			break;
		case pieceKnight:
			pcTyp = 'n';
			break;
		case pieceBishop:
			pcTyp = 'b';
			break;
		case pieceRook:
			pcTyp = 'r';
			break;
		case pieceQueen:
			pcTyp = 'q';
			break;
		case pieceKing:
			pcTyp = 'k';
			break;
	}

	if (pcTyp == null) {
		return null;
	} else {
		var setNo = 1;
		var pcClr = (piece & 0x8) ? "w" : "b";
		return 'images/ch' + pcClr + pcTyp + setNo + '.png';
	}

}

function RedrawPieces() {
	for (y = 0; y < 8; ++y) {
		for (x = 0; x < 8; ++x) {
			var td = g_uiBoard[y * 8 + x];
			var pieceY = g_playerWhite ? y : 7 - y;
			var piece = g_board[((pieceY + 2) * 0x10) + (g_playerWhite ? x : 7 - x) + 4];
			var pieceName = pcName(piece);
			/*
			var pcTyp = 'p';
			switch (piece & 0x7) {
				case piecePawn:
					pieceName = "pawn";
					pcTyp = 'p';
					break;
				case pieceKnight:
					pieceName = "knight";
					pcTyp = 'n';
					break;
				case pieceBishop:
					pieceName = "bishop";
					pcTyp = 'b';
					break;
				case pieceRook:
					pieceName = "rook";
					pcTyp = 'r';
					break;
				case pieceQueen:
					pieceName = "queen";
					pcTyp = 'q';
					break;
				case pieceKing:
					pieceName = "king";
					pcTyp = 'k';
					break;
			}
			if (pieceName != null) {
				pieceName += "_";
				pieceName += (piece & 0x8) ? "white" : "black";
			}

			var 
			*/

			if (pieceName != null) {
				var img = document.createElement("div");
				//				$(img).addClass('sprite-' + pieceName);

				//img.classList = '';
				//				if (img.classList)
				//					img.classList.add('sprite-' + pieceName);
				//				else
				//					img.className += ' ' + 'sprite-' + pieceName;
				//s += '<img id="pc' + id + '" class="player-piece" alt="' + id + '" style="position: absolute; left:' + xp + 'px; top:' + yp + 'px; height: 48px; width: 48px;" src="images/ch' + id.substr(0, 2) + setNo + '.png">';
				var setNo = 1;
				var pcClr = (piece & 0x8) ? "w" : "b";
				//var imgSrc = 'images/ch' + pcClr + pcTyp + setNo + '.png';

				//img.style.backgroundImage = "url('images/sprites.png')";
				img.style.backgroundImage = 'url("' + pieceName + '")';
				img.style.backgroundSize = g_cellSize + 'px ' + g_cellSize + 'px';
				//				img.width = g_cellSize;
				//				img.height = g_cellSize;
				img.style.width = g_cellSize + 'px';
				img.style.height = g_cellSize + 'px';
				var divimg = document.createElement("div");
				divimg.appendChild(img);

				//				$(divimg).draggable({
				//					start: function (e, ui) {
				//						if (g_selectedPiece === null) {
				//							g_selectedPiece = this;
				//							var offset = $(this).closest('table').offset();
				//							g_startOffset = {
				//								left: e.pageX - offset.left,
				//								top: e.pageY - offset.top
				//							};
				//						} else {
				//							return g_selectedPiece == this;
				//						}
				//					}
				//				});
				//

				//				$(divimg).mousedown(function (e) {
				//				divimg.addEventListener("mousedown", function (e) {
				//					if (g_selectedPiece === null) {
				//						var offset = $(this).closest('table').offset();
				//						g_startOffset = {
				//							left: e.pageX - offset.left,
				//							top: e.pageY - offset.top
				//						};
				//						e.stopPropagation();
				//						g_selectedPiece = this;
				//						g_selectedPiece.style.backgroundImage = "url('img/transpBlue50.png')";
				//					} else if (g_selectedPiece === this) {
				//						g_selectedPiece.style.backgroundImage = null;
				//						g_selectedPiece = null;
				//					}
				//				}, false);
				//$(td).empty().append(divimg);
				td.innerHTML = '';
				td.appendChild(divimg);

			} else {
				//$(td).empty();
				td.innerHTML = '';
			}
		}
	}
}

function RedrawBoard() {
	//var div = $("#board")[0];
	var div = document.getElementById('board');
	//var div = $("#board")[0];

	var table = document.createElement("table");
	table.cellPadding = "0px";
	table.cellSpacing = "0px";
	//	$(table).addClass('no-highlight');

	if (table.classList)
		table.classList.add('no-highlight');
	else
		table.className += ' ' + 'no-highlight';

	var tbody = document.createElement("tbody");

	g_uiBoard = [];

	for (y = 0; y < 8; ++y) {
		var tr = document.createElement("tr");

		for (x = 0; x < 8; ++x) {
			var td = document.createElement("td");
			td.style.width = g_cellSize + "px";
			td.style.height = g_cellSize + "px";
			//td.style.backgroundColor = ((y ^ x) & 1) ? "#D18947" : "#FFCE9E";
			td.style.backgroundColor = ((y ^ x) & 1) ? "#b58863" : "#f0d9b5";
			tr.appendChild(td);
			g_uiBoard[y * 8 + x] = td;
		}

		tbody.appendChild(tr);
	}

	table.appendChild(tbody);

	RedrawPieces();

	//$(div).empty();
	div.innerHTML = '';

	div.appendChild(table);

	g_changingFen = true;
	document.getElementById("FenTextBox").value = GetFen();
	g_changingFen = false;
}

function getRandomInt(min, max) {
	// inclusive min and max
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function soundBtnHTML() {

	s = ''
	s += '<style> '
	s += ' .speaker { height: 30px; width: 30px; position: relative; overflow: hidden; display: inline-block; vertical-align:top; } '
	s += ' .speaker span { display: block; width: 9px; height: 9px; background-color: blue; margin: 10px 0 0 1px; }'
	s += ' .speaker span:after { content: ""; position: absolute; width: 0; height: 0; border-style: solid; border-color: transparent blue transparent transparent; border-width: 10px 16px 10px 15px; left: -13px; top: 5px; }'
	s += ' .speaker span:before { transform: rotate(45deg); border-radius: 0 60px 0 0; content: ""; position: absolute; width: 5px; height: 5px; border-style: double; border-color: blue; border-width: 7px 7px 0 0; left: 18px; top: 9px; transition: all 0.2s ease-out; }'
	s += ' .speaker:hover span:before { transform: scale(.8) translate(-3px, 0) rotate(42deg); }'
	s += ' .speaker.mute span:before { transform: scale(.5) translate(-15px, 0) rotate(36deg); opacity: 0; }'
	s += ' </style>'

	s += '<div id="sound" onClick="soundToggle()" class="speaker"><span></span></div>'

	return s
}

function soundToggle() {
	var btn = 'sound'
	if (my.soundQ) {
		my.soundQ = false
		document.getElementById(btn).classList.add("mute")
	} else {
		my.soundQ = true
		document.getElementById(btn).classList.remove("mute")
	}
}
function soundStopAll() {
	// useful to stop sounds before next sound comes along
  var sounds = document.getElementsByTagName('audio');
  for(i=0; i<sounds.length; i++) {
		sounds[i].pause();
		sounds[i].currentTime = 0.0;
	}
}
