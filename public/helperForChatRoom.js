{/* <div class="chat-card-wrap">
	<div class="chat-card-name">Mike :</div>
	<div class="chat-card-msg">Hello Mate</div>
</div> */}

function recivedMessage(message,name){
	const msgEl = document.createElement('div')
	msgEl.classList.add('chat-card-wrap');
	let div = document.createElement('div');
	div.classList.add('chat-card-name');
	div.innerText = name + " :"
	msgEl.appendChild(div);
	div = document.createElement('div');
	div.classList.add('chat-card-msg');
	div.innerText = message +'';
	msgEl.appendChild(div);
	chatDisplay.appendChild(msgEl)
	chatDisplay.scrollTop=chatDisplay.scrollHeight;
}
function sentMessage(message){
	const msgEl = document.createElement('div')
	msgEl.classList.add('chat-card-wrap');
	let div = document.createElement('div');
	div.classList.add('chat-card-name');
	div.innerText = "(You) :"
	msgEl.appendChild(div);
	div = document.createElement('div');
	div.classList.add('chat-card-msg');
	div.innerText = message ;
	msgEl.appendChild(div);
	msgEl.style.backgroundColor = 'rgb(190, 190, 180)'
	chatDisplay.appendChild(msgEl)

	chatDisplay.scrollTop=chatDisplay.scrollHeight;
}
function UrlDecode(url){
    if(!url){
        url = location.search.slice(1)
    }
    const array = url.split('&')
    const output = {}
    for(i=0;i<array.length;i++){
        array[i] = array[i].split('=')
        output[array[i][0]] = array[i][1]
    }
    return output
}
