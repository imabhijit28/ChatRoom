var stompClient = null;

function sendMessage(){
	let jsonOb={
		name:localStorage.getItem("name"),
		content:$("#message-value").val()
	}
	if ($("#message-value").val() != '') {
		stompClient.send("/app/message", {}, JSON.stringify(jsonOb))
		$('#message-value').val('')
	} else {
		alert("Nothing To Send")
	}
}

function connect(){
	let socket = new SockJS("/server1")
	
	stompClient = Stomp.over(socket)
	stompClient.connect({},function(frame){
		console.log("Connected : "+frame)
		
		$("#name-form").addClass('d-none')
		$("#chat-room").removeClass('d-none')
		
		stompClient.subscribe("/topic/return-to",function(response){
			
			showMessage(JSON.parse(response.body))
		})
	})
}

function showMessage(message){
	$("#message-container-table").prepend(`<tr><td><b>${message.name} :</b> ${message.content}</td></tr>`)
}


$(document).ready((e)=>{
	
	$("#login").click(()=>{
		
		let name = $("#name-value").val()
		if(name!=''){
			localStorage.setItem("name",name)
			$("#name-title").html(`<b>Welcome ${name}</b>`)
			connect();
		}else {
			alert("Please enter your name")
		}
	})
	
	$("#send-btn").click(()=>{
		sendMessage()
	})
	
	$("#logout").click(()=>{
		localStorage.removeItem("name")
		if(stompClient!=null){
			stompClient.disconnect()
			$("#name-form").removeClass('d-none')
			$("#chat-room").addClass('d-none')
			console.log(stompClient)
		}
	})
	
})