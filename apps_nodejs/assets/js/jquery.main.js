/*! Main v1.00.0 | (c) 2014, 2014 | */

 //INIT 
 //SIZE 
 //PLACE
 //NAVIGATION
 //COMMUNICATION
 //LOG OUT
 //CONNECTIONS
 //FIND USERS

/* ===== INIT ===== */ 

var windowWidth = $(window).width();
var windowHeight = $(window).height();

$(window).resize(function(){
	//Window Resize
});

$(document).ready(function(){
	//Document Ready
});

/* ===== SIZE ===== */ 

var gameCanvasWidth = $('#game-canvas').attr('width');
var gameCanvasHeight = $('#game-canvas').attr('height');

$('#game-canvas').css({'width': gameCanvasWidth+'px', 'height': gameCanvasHeight+'px', 'margin-top': '-'+(gameCanvasHeight/2)+'px', 'margin-left': '-'+(gameCanvasWidth/2)+'px'});

/* ===== PLACE ===== */

var userName = '';
var userLeft = '';
var userTop = '';
var userTexto = '';
//criarNome
var possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
for( var i=0; i < 3; i++ ) {
	userName += possible.charAt(Math.floor(Math.random() * possible.length));
}
//criarLeft/Top
var userLeft = (gameCanvasWidth-$('.user.you').width())/2;
var userTop = (gameCanvasHeight-$('.user.you').height())/2;
//criarUser
$('#game-canvas').prepend('<div class="user you '+userName+'"></div>');
$('.user.you').css({'top': userTop, 'left': userLeft});
connecta(userName, userTop, userLeft, userTexto, 'criarUser');

/* ===== NAVIGATION ===== */

var userMoveLength = 10;

window.onkeydown = pressionaTecla;

function pressionaTecla(e) {
	//DOWN
	if (e.keyCode==40) {
		userMove($('.user.you'), 'down');
	}
	//RIGHT
	else if (e.keyCode==39) {
		userMove($('.user.you'), 'right');
	} 
	//LEFT
	else if (e.keyCode==37) {
		userMove($('.user.you'), 'left');
	}
	//UP
	else if (e.keyCode==38) {
		userMove($('.user.you'), 'up');
	}
}

function userMove(user, direction) {
	if (direction == 'down') {
		var userFutureDown = parseInt(user.css('top').slice(0,-2))+userMoveLength;
		if(userFutureDown<=gameCanvasHeight-user.height()){
			userTop = userFutureDown;
			user.css('top', userTop+'px');
			connecta(userName, userTop, userLeft, userTexto, 'mudaUser');
		}
	} else if (direction == 'up') {
		var userFutureUp = parseInt(user.css('top').slice(0,-2))-userMoveLength;
		if(userFutureUp>=0){
			userTop = userFutureUp;
			user.css('top', userTop+'px');
			connecta(userName, userTop, userLeft, userTexto, 'mudaUser');
		}
	} else if (direction == 'left') {
		var userFutureLeft = parseInt(user.css('left').slice(0,-2))-userMoveLength;
		if(userFutureLeft>=0){
			userLeft = userFutureLeft;
			user.css('left', userLeft+'px');
			connecta(userName, userTop, userLeft, userTexto, 'mudaUser');
		}
	} else if (direction == 'right') {
		var userFutureRight = parseInt(user.css('left').slice(0,-2))+userMoveLength;
		if(userFutureRight<=gameCanvasWidth-user.width()){
			userLeft = userFutureRight;
			user.css('left', userLeft+'px');
			connecta(userName, userTop, userLeft, userTexto, 'mudaUser');
		}
	}
}

/* ===== COMMUNICATION ===== */

$('#game-canvas').append('<div class="communication-box"><input type="text" placeholder="Falar" maxlength="140"><a href="#" class="btn enviar">Enviar</a></div>');

$('.btn.enviar').click(function(e){
	e.preventDefault();
	if($('.communication-box').find('input').val()==''){
		$('.communication-box').find('input').css({'border':'1px solid red'}).select();
	} else {
		$('.communication-box').find('input').removeAttr('style');
		comunicar($('.user.you'), $('.communication-box').find('input').val());
		$('.communication-box').find('input').val('');
	}
});

function comunicar(user, texto) {
	userTexto = texto;
	user.empty().append('<p>'+userTexto+'</p>');
	connecta(userName, userTop, userLeft, userTexto, 'mudaUser');
	setTimeout(function(){
		userTexto = '';
		user.empty();
		connecta(userName, userTop, userLeft, userTexto, 'mudaUser');
	}, 5000);
}

/* ===== SOCKET IO ===== */

function connecta(nome, top, left, texto, action) {
	var user_data = nome+'/'+top+'/'+left+'/'+texto+'/'+action;
	socket.emit('user change', user_data);
	socket.emit('data', user_data);
}

socket.on('user change', function(user_data){
	if (user_data.split('/')[0]!=userName) {
		var thisUserName = user_data.split('/')[0];
		var thisUserTop = user_data.split('/')[1];
		var thisUserLeft = user_data.split('/')[2];
		var thisUserTexto = '';
		if(user_data.split('/')[3]!=''){
			thisUserTexto = '<p>'+user_data.split('/')[3]+'</p>';
		}
		var thisUserAction = user_data.split('/')[4];
		$('.user.'+thisUserName).remove();
		if(thisUserAction!='deletarUser'){
			$('#game-canvas').prepend('<div class="user '+thisUserName+'" style="top: '+thisUserTop+'px; left: '+thisUserLeft+'px;">'+thisUserTexto+'</div>');
		}
	}
});

//First time getting on
socket.on('first user', function(user_data){
	if (user_data.split('/')[0]!=userName) {
		var thisUserName = user_data.split('/')[0];
		var thisUserTop = user_data.split('/')[1];
		var thisUserLeft = user_data.split('/')[2];
		var thisUserTexto = '';
		if(user_data.split('/')[3]!=''){
			thisUserTexto = '<p>'+user_data.split('/')[3]+'</p>';
		}
		var thisUserAction = 'criarUser';
		$('#game-canvas').prepend('<div class="user '+thisUserName+'" style="top: '+thisUserTop+'px; left: '+thisUserLeft+'px;">'+thisUserTexto+'</div>');
	}
});

//User logout
socket.on('logout user', function(user_data){
	if (user_data.split('/')[0]!=userName) {
		var thisUserName = user_data.split('/')[0];
		$('.user.'+thisUserName).remove();
	}
});