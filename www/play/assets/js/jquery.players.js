/*! Main v1.00.0 | (c) 2014, 2014 | */

/* ========== Require Players ========== */

/* ===== SOCKET IO ===== */

function connecta(nome, top, left, texto, action, direction, position) {
	var user_data = nome+'/'+top+'/'+left+'/'+texto+'/'+action+'/'+direction+'/'+position;
	socket.emit('user change', user_data);
	socket.emit('data', user_data);
}

/*socket.on('user change', function(user_data){
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

//User logout
socket.on('logout user', function(user_data){
	if (user_data.split('/')[0]!=userName) {
		var thisUserName = user_data.split('/')[0];
		$('.user.'+thisUserName).remove();
	}
});*/