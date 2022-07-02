function recivedMessage(message,name){
	const msgEl = document.createElement('div')
	msgEl.classList.add('recived-message')
	msgEl.classList.add('message')
	msgEl.innerHTML=`<span class="box"></span>`
	const span = document.createElement('span');
	span.innerText =`${name} : ${message}`
	msgEl.appendChild(span);
	chatDisplay.appendChild(msgEl)
	chatDisplay.scrollTop=chatDisplay.scrollHeight;
}
function sentMessage(message){
	const msgEl = document.createElement('div')
	msgEl.classList.add('sent-message')
	msgEl.classList.add('message')
	msgEl.innerHTML=`<span class="box"></span>`
	const span = document.createElement('span');
	span.innerText = `${message}`
	msgEl.appendChild(span);
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
