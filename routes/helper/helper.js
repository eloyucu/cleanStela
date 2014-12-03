var nodemailer	= require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'eatec.apps@gmail.com',
        pass: 'YX-F:zcS^yob'
    }
});


exports.sendAnEmail = function(receivers, tittle, user, message, jsonBack)
{
	var styles = '<style>'+
					'.user-container'+
					'{'+
						'padding: 30px;'+
						'background-color:#b39e75' + 
						'border-radius: 10px 10px 10px 10px;'+
						'-moz-border-radius: 10px 10px 10px 10px;'+
						'-webkit-border-radius: 10px 10px 10px 10px;'+
						'border: 0px solid #000000;'+
						'-webkit-box-shadow: 10px 10px 5px 0px rgba(0,0,0,0.75);'+
						'-moz-box-shadow: 10px 10px 5px 0px rgba(0,0,0,0.75);'+
						'box-shadow: 10px 10px 5px 0px rgba(0,0,0,0.75);'+
					'}'+
					'.user'+
					'{'+
						'padding: 10px;'+
						'background: rgba(146,221,214,1);'+
						'background: -moz-linear-gradient(left, rgba(146,221,214,1) 0%, rgba(117,209,200,1) 24%, rgba(117,209,200,1) 24%, rgba(117,209,200,1) 56%, rgba(12,167,151,1) 100%);'+
						'background: -webkit-gradient(left top, right top, color-stop(0%, rgba(146,221,214,1)), color-stop(24%, rgba(117,209,200,1)), color-stop(24%, rgba(117,209,200,1)), color-stop(56%, rgba(117,209,200,1)), color-stop(100%, rgba(12,167,151,1)));'+
						'background: -webkit-linear-gradient(left, rgba(146,221,214,1) 0%, rgba(117,209,200,1) 24%, rgba(117,209,200,1) 24%, rgba(117,209,200,1) 56%, rgba(12,167,151,1) 100%);'+
						'background: -o-linear-gradient(left, rgba(146,221,214,1) 0%, rgba(117,209,200,1) 24%, rgba(117,209,200,1) 24%, rgba(117,209,200,1) 56%, rgba(12,167,151,1) 100%);'+
						'background: -ms-linear-gradient(left, rgba(146,221,214,1) 0%, rgba(117,209,200,1) 24%, rgba(117,209,200,1) 24%, rgba(117,209,200,1) 56%, rgba(12,167,151,1) 100%);'+
						'background: linear-gradient(to right, rgba(146,221,214,1) 0%, rgba(117,209,200,1) 24%, rgba(117,209,200,1) 24%, rgba(117,209,200,1) 56%, rgba(12,167,151,1) 100%);'+
						'filter: progid:DXImageTransform.Microsoft.gradient( startColorstr="#92ddd6", endColorstr="#0ca797", GradientType=1 )'+
					'}'+
					'.messsage-container'+
					'{'+
						'padding:30px;'+
						'background: rgba(76,76,76,1);'+
						'background: -moz-linear-gradient(left, rgba(76,76,76,1) 0%, rgba(89,89,89,1) 12%, rgba(102,102,102,1) 25%, rgba(71,71,71,1) 39%, rgba(44,44,44,1) 43%, rgba(28,28,28,1) 66%, rgba(17,17,17,1) 71%, rgba(43,43,43,1) 76%, rgba(0,0,0,1) 94%, rgba(19,19,19,1) 100%);'+
						'background: -webkit-gradient(left top, right top, color-stop(0%, rgba(76,76,76,1)), color-stop(12%, rgba(89,89,89,1)), color-stop(25%, rgba(102,102,102,1)), color-stop(39%, rgba(71,71,71,1)), color-stop(43%, rgba(44,44,44,1)), color-stop(66%, rgba(28,28,28,1)), color-stop(71%, rgba(17,17,17,1)), color-stop(76%, rgba(43,43,43,1)), color-stop(94%, rgba(0,0,0,1)), color-stop(100%, rgba(19,19,19,1)));'+
						'background: -webkit-linear-gradient(left, rgba(76,76,76,1) 0%, rgba(89,89,89,1) 12%, rgba(102,102,102,1) 25%, rgba(71,71,71,1) 39%, rgba(44,44,44,1) 43%, rgba(28,28,28,1) 66%, rgba(17,17,17,1) 71%, rgba(43,43,43,1) 76%, rgba(0,0,0,1) 94%, rgba(19,19,19,1) 100%);'+
						'background: -o-linear-gradient(left, rgba(76,76,76,1) 0%, rgba(89,89,89,1) 12%, rgba(102,102,102,1) 25%, rgba(71,71,71,1) 39%, rgba(44,44,44,1) 43%, rgba(28,28,28,1) 66%, rgba(17,17,17,1) 71%, rgba(43,43,43,1) 76%, rgba(0,0,0,1) 94%, rgba(19,19,19,1) 100%);'+
						'background: -ms-linear-gradient(left, rgba(76,76,76,1) 0%, rgba(89,89,89,1) 12%, rgba(102,102,102,1) 25%, rgba(71,71,71,1) 39%, rgba(44,44,44,1) 43%, rgba(28,28,28,1) 66%, rgba(17,17,17,1) 71%, rgba(43,43,43,1) 76%, rgba(0,0,0,1) 94%, rgba(19,19,19,1) 100%);'+
						'background: linear-gradient(to right, rgba(76,76,76,1) 0%, rgba(89,89,89,1) 12%, rgba(102,102,102,1) 25%, rgba(71,71,71,1) 39%, rgba(44,44,44,1) 43%, rgba(28,28,28,1) 66%, rgba(17,17,17,1) 71%, rgba(43,43,43,1) 76%, rgba(0,0,0,1) 94%, rgba(19,19,19,1) 100%);'+
						'filter: progid:DXImageTransform.Microsoft.gradient( startColorstr="#4c4c4c", endColorstr="#131313", GradientType=1 )'+
					'}'+
					'.messsage'+
					'{'+
						'padding:10px;'+
						'background-color:#1E90FF;'+
						'-webkit-box-shadow: 6px 5px 35px 5px rgba(208,224,208,1);'+
						'-moz-box-shadow: 6px 5px 35px 5px rgba(208,224,208,1);'+
						'box-shadow: 6px 5px 35px 5px rgba(208,224,208,1);'+
					'}'+
				'</style>';
	var div1 = '<div class="user-container"> <div class="user">'+user+'</div></div>';
	var div2 = '<div class="message-container"> <div class="message">'+message+' <br> GRACIAS. <br><br>Everything under control. <br>CleanStela Pego.</div></div>';
	//writeOnTheLog('Intento de enviar un correo electrónico.');
	var mailOptions = 
	{
		from: "CleanStela eatec.apps@gmail.com", // sender address
		to: receivers,
		subject: tittle, // Subject line
		html: styles+div1+div2 // html body
	};
	transporter.sendMail(mailOptions, function(err, response)
	{
		if(err)
			console.log("email.js->sendAnEmail-> error: " + err)
			//writeOnTheLog('<div class="notdisapear"  style="color: red;">Ocurrio un error en el envío del email, intentalo mas tarde </div>');
		else
			console.log("email.js->sendAnEmail-> NO error")
			//writeOnTheLog('<div class="notdisapear"  style="color: FireBrick;">El email ha sido enviado con exito </div>');
	});		
}