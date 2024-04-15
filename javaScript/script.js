async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`/${folder}/`);
    let response = await a.text();
    // console.log(response); 
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    } 

//  show all songs in playlist
let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
songUL.innerHTML = "blank";
//show all the songs in playlist
for (const song of songs) {
    songUL.innerHTML = songUL.innerHTML+`<li> 
                    <img class="invert" src="svgs/music.svg" alt="">
                    <div class="info">
                        <div>  ${song.replaceAll("s/"," ")}</div>
                        <div>Roshan</div>
                    </div>
                    <div class="playnow">
                      <span>Play Now</span>
                    <img src="svgs/play.svg" alt="">
                </div>
       </li>`;
}
//play the first song
// var audio = new Audio(songs[7]);
// audio.play();

// audio.addEventListener("loadeddata",() => {
//     console.log(audio.duration, audio.currentSrc, audio.currentTime);
// })
//attch an event listner to each song

Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
e.addEventListener("click",element=>{
// console.log(e.querySelector(".info").firstElementChild.innerHTML);
playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
})
})


    return songs;
}

let currentSong= new Audio();  
let  songs;
let currFolder;

const playMusic = (track, pause=false)=>{
    //let audio = new Audio("/songs/" + track);
    currentSong.src = `/${currFolder}/` + track;

    if(!pause){
    currentSong.play();
    play.src="svgs/pause.svg";
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
 
}


//Display all the album on the page
async function displayAlbums(){
    let cardContainer = document.querySelector(".cardContainer")
    let a = await fetch(`/songs/`);
    let response = await a.text();
    // console.log(response); 
    let div = document.createElement("div");
     div.innerHTML = response;
     let anchors = div.getElementsByTagName("a");
     console.log(anchors)
     let array = Array.from(anchors)
     for (let index = 0; index < array.length; index++) {
        const e = array[index];
     
        if(e.href.includes("/songs/")){
            let folder = e.href.split("/").slice(-1)[0]
            console.log(folder)
            //get the meta data
            let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json()
             console.log(response)
             cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder=${folder} class="card">
             <div class="play">
                 <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 8 8" id="Play">
                     <path d="M4 0 C1.79 0 0 1.79 0 4 s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zM3 2 l3 2-3 2V2z"
                         fill="#00FF00" class="color000000 svgShape" />
                 </svg>
             </div>
             <img src="/songs/${folder}/cover.jpg" alt="">
             <h2>${response.title}</h2>
             <p>${response.description}</p>
         </div>`
        }
    }
     //Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
    e.addEventListener("click",async item=>{
        songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
        playMusic(songs[0]);
    })
})
}

async function main() {

//get the list of all songs
        songs = await getSongs("songs/ncs");
        playMusic(songs[0].replaceAll("s/",""),true);
        // console.log(songs);
      

//Display all the album on the page
displayAlbums();


//Attach an event listner to play, next and previous
play.addEventListener("click",()=>{
    if (currentSong.paused){
        currentSong.play();
        play.src="svgs/pause.svg";
    }
    else
        {
            currentSong.pause();
             play.src="svgs/play.svg";
        }
})

// Listen for time update function
currentSong.addEventListener("timeupdate", () => {
    // console.log(currentSong.currentTime, currentSong.duration);
    // const currentTime = formatTime(currentSong.currentTime);
    // const duration = formatTime(currentSong.duration);
    // document.querySelector(".songtime").innerHTML = currentTime + "/" + duration;
    // document.querySelector(".circle").style.left = (currentSong.currentTime/ currentSong.duration)*100 + "%";
    document.querySelector(".songtime").innerHTML = `${secondsToMinuteSeconds(currentSong.currentTime)}/${secondsToMinuteSeconds(currentSong.duration)}`;
    document.querySelector(".circle").style.left = (currentSong.currentTime/ currentSong.duration)*100+"%";
    let percent = (currentSong.currentTime / currentSong.duration);
    let backgroundColor = `linear-gradient(to right, red ${percent * 100}%, white ${percent * 100}%)`;
    document.querySelector(".seekbar").style.background = backgroundColor;
});

// currentSong.addEventListener("timeupdate", () => {
//     if (!isNaN(currentSong.currentTime) && !isNaN(currentSong.duration)) {
//         document.querySelector(".songtime").innerHTML = `${secondsToMinuteSeconds(currentSong.currentTime)}/${secondsToMinuteSeconds(currentSong.duration)}`;
//         document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
//     }
// });

function secondsToMinuteSeconds(seconds) {
if(isNaN(seconds) || seconds < 0){
    return "00:00";
}

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${(remainingSeconds < 10 ? '0' : '')}${remainingSeconds}`;
}


//Add event listner to seekbar

document.querySelector(".seekbar").addEventListener("click", e => {
    // console.log("Seekbar clicked");
    let percent = (e.offsetX / e.target.getBoundingClientRect().width);
    document.querySelector(".circle").style.left = percent * 100 + "%";
    currentSong.currentTime = (currentSong.duration * percent);
    
});


// function formatTime(seconds) {
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = Math.floor(seconds % 60);
//     return `${minutes}:${(remainingSeconds < 10 ? '0' : '')}${remainingSeconds}`;
// }

//Add an event listner for hamburger
document.querySelector(".hamburger").addEventListener("click", ()=>{
    document.querySelector(".left").style.left = "0";
})

//Add an event listner for closing of hamburger
document.querySelector(".hamClose").addEventListener("click", ()=>{
    document.querySelector(".left").style.left = "-100%";
})


// previous.addEventListener("click", () => {
//     // console.log(currentSong.src)
//     let index = songs.indexOf("s/" + currentSong.src.slice(-1) [0])
//     if((index) > 0){
//         index=index-1;
//         let filename = songs[index];
//         filename = filename.replace("s/", "");
//         console.log(filename); // Output: "HanumanChalisa.mp3"
//         playMusic(filename)
//         console.log(songs[index])
//     }
//     else{
//         console.log("error")
//     }
// })

// next.addEventListener("click", () => {
//     // console.log(currentSong.src.split("/").slice(-1))
//    let index = songs.indexOf("s/" + currentSong.src.split("/").slice(-1) [0])   
//     // console.log(index)
// //    console.log( currentSong.src.split("/").slice(-1) [0])
//  console.log("s/" + currentSong.src.split("/").slice(-1) [0])
//     if((index+1) > length){
//     // playMusic(songs[index+1])
//     index=index+1;
//     let filename = songs[index];
//     filename = filename.replace("s/", "");
//     console.log(filename); // Output: "HanumanChalisa.mp3"

//     playMusic(filename)
//     console.log(songs[index])
//  }

// })

previous.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index > 0) {
        index = index - 1;
        let filename = songs[index];
        filename = filename.replace("s/", "");
        // console.log(filename);
        playMusic(filename);
        // console.log(songs[index]);
    } else {
        playMusic(songs[songs.length-1])
    }
});

next.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    // console.log(songs.indexOf(`${currentSong.src.split("/").slice(-1)[0]}`))
    // console.log(currentSong.src.split("/").slice(-1)[0])
    if (index !== -1 && (index + 1) < songs.length) {
        index = index + 1;
        let filename = songs[index];
        // filename = filename.replace("s/", "");
        // console.log(filename);
        playMusic(filename);
        // console.log(songs[index]);
    } else {
        playMusic(songs[0])
    }
});

//Add an event to volume
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
    // console.log(e)
    //   console.log("setting volume to ",e.target,e.target.value);
      currentSong.volume = parseInt(e.target.value)/100;
});

document.querySelector(".volume>img").addEventListener("click", e=>{
    // console.log(e.target);
    if(e.target.src.includes("svgs/volume.svg")){
        e.target.src= e.target.src.replace("svgs/volume.svg", "svgs/mute.svg");
        currentSong.volume =0;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
    }
    else{
        e.target.src= e.target.src.replace("svgs/mute.svg", "svgs/volume.svg");
        currentSong.volume = 1;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
    }
})

}

main();
