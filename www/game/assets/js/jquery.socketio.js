/*! Main v1.00.0 | (c) 2014, 2014 | */

/* ========== Require Players ========== */

/* ===== SOCKET IO ===== */

function connecta(position_x, position_y, this_name, vetor) {
	var user_data = position_x+'/'+position_y+'/'+this_name+'/'+vetor;
	socket.emit('user change', user_data);
	socket.emit('data', user_data);
}

//First time getting on
socket.on('first user', function(user_data){
	var thisUserX = user_data.split('/')[0];
	var thisUserY = user_data.split('/')[1];
	var thisUserName = user_data.split('/')[2];
	var thisUserVetor = user_data.split('/')[3];
	user_placement(thisUserX, thisUserY, thisUserName, thisUserVetor);
});

socket.on('start placement', function(user_data){
	place_this_user();
});

/* ========== Place Users ========== */

socket.on('user change', function(user_data){
	if(user_data.split('/')[2]!=user_name){
		var thisUserX = user_data.split('/')[0];
		var thisUserY = user_data.split('/')[1];
		var thisUserName = user_data.split('/')[2];
		var thisUserVetor = user_data.split('/')[3];
		if($('.'+thisUserName).length) {
			if($('.'+thisUserName).data('x')==thisUserX && $('.'+thisUserName).data('y')==thisUserY){
				user_vetor(thisUserVetor, thisUserName);
			} else {
				user_motion(thisUserVetor, thisUserName);
			}
		} else {
			user_placement(thisUserX, thisUserY, thisUserName, thisUserVetor);
		}
	}
});

//User logout
socket.on('logout user', function(user_data){
	if (user_data.split('/')[2]!=user_name) {
		alert(user_data);
		var thisUserName = user_data.split('/')[2];
		alert('x = '+$('.'+thisUserName).data('x')+' e y = '+$('.'+thisUserName).data('y')+' e nome = .'+thisUserName);
		work_grid($('.'+thisUserName).data('x'), $('.'+thisUserName).data('y'), 'null');
		$('.'+thisUserName).remove();
	}
});