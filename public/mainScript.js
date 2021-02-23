const roomList = document.querySelectorAll('.room-name')
const roomNameEl = document.querySelector('.room-input')

for(i of roomList){
   i.addEventListener('click',listnerForRoomNames)
}

function listnerForRoomNames(e){
      roomNameEl.value = e.target.innerText
}
