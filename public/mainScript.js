const roomList = document.querySelectorAll('.room-name')
const roomNameEl = document.querySelector('.room-input')
const kuralEl = document.querySelector('[kural]');
const kuralNumEl = document.querySelector('[kural-num]');
const cardList = document.querySelector('[room-list-parant]');

for(i of roomList){
   i.addEventListener('click',listnerForRoomNames)
}

function listnerForRoomNames(e){
      roomNameEl.value = e.target.innerText
}

console.log('hello');

const fun = async ()=>{
      console.log('lol');
      const data = await axios.get('https://ped-kural.herokuapp.com/random');
      kuralEl.innerText = data.data.Translation;
      kuralNumEl.innerText = data.data.Number;
      console.log(data);
}
fun();

const socket = io('wss://godispatcher.herokuapp.com');
// const socket = io('ws://localhost:3000');


socket.on('connect', async () => {
      console.log('connected');
      socket.on('room-deleted',data =>{
            console.log(data,'deleted');
            removeCard(data.roomid);
      });
      socket.on('room-created',data =>{
            console.log(data,'created');
            addCard(data);
      })
})

function removeCard(id){
      const el = document.querySelector(`[roomid =${id}]`);
      console.log(el);
      if(!el) return;
      el.remove();
}

function addCard(data){
      if(document.querySelector(`[${data.roomid}]`)) return;
      const div = document.createElement('div');
      cardList.appendChild(div);
      div.outerHTML= `
            <div class="room-card" room-item roomid ="${data.roomid}">
                        <h1> ${data.roomname} </h1>
                        <p class="discription"> ${data.topics }</p>
            </div >
      `;
}

document.addEventListener('click',e=>{
      try{
            if (e.target.attributes['create-btn']){
                  location.href = `/create`;
            }
            e.path.forEach(el => {
                  if (el.attributes['room-item']) {
                        // console.log(el);
                        console.log(el.attributes['roomid']);
                        location.href = `/prejoin?roomid=${el.attributes['roomid'].value}`;
                        return;
                  }
            });
      }catch(e){
            console.log(e);
      }
})