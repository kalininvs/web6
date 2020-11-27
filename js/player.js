
var fileLoad = document.getElementById('file-input');
//Плеер
var audioContainer = document.getElementsByClassName('audio-container');
var audioPlayer = document.getElementById('audio-player');
//
var playlist = document.getElementById('playlist');
//Время
var progressBar = document.getElementById('audio-hud__progress-bar');
var currTime = document.getElementById('audio-hud__curr-time');
var durationTime = document.getElementById('audio-hud__duration');

//Кнопки
var actionButton = document.getElementById('audio-hud__action');
var muteButton = document.getElementById('audio-hud__mute');
var volumeScale = document.getElementById('audio-hud__volume');
var speedSelect = document.getElementById('audio-hud__speed');
var prevAudio = document.getElementById('audio-hud__prev');
var nextAudio = document.getElementById('audio-hud__next');
var dataSrc = ['audio/sound1.mp3','audio/sound2.mp3'];
playlist.addEventListener('click',clickPlaylist); //клик на песню
actionButton.addEventListener('click',audioPlayStop); //запуск воспроизведения
audioPlayer.addEventListener('click',audioPlayStop); //остановка воспроизведения трека

progressBar.addEventListener('click',audioChangeTime); //клик по прогресс бару
volumeScale.addEventListener('change',audioChangeVolume);
muteButton.addEventListener('click',audioMute); //выключить звук
speedSelect.addEventListener('change',audioChangeSpeed);//меняем скорость воспроизведения
fileLoad.addEventListener('change',fileAudio); //загрузка песни
prevAudio.addEventListener('click',prevOrNextSong);//предыдущая песня
nextAudio.addEventListener('click',prevOrNextSong);//следующая песня
document.addEventListener('keydown', function(event) {
    if(event.key == 'A'||event.key=='a'||event.key=='ф'||event.key == 'Ф') {
        prevOrNextSong("audio-hud__prev");
    }
    if(event.key == 'D'||event.key=='d'||event.key=='в'||event.key == 'В') {
        prevOrNextSong("audio-hud__next");
    }
    if(event.key == "ArrowRight"){
        audioPlayer.currentTime += 1;
    }
    if(event.key == "ArrowLeft"){
        audioPlayer.currentTime -= 1;
    }
    if(event.key == "ArrowUp"){
        var volume = Number(volumeScale.value);
        if(volume!="100")
        {
            volumeScale.value = volume + 2 > 100 ?  100 : volume + 2;
            audioChangeVolume();
        }
    }
    if(event.key == "ArrowDown"){
        var volume = Number(volumeScale.value);
        if(volume!="0")
        {
            volumeScale.value = volume - 2 < 0 ?  0 : volume - 2;
            audioChangeVolume();
        }
    }
    
})
onload = new function(){
    loadplaylist();
}
function fileAudio(){
    var item = URL.createObjectURL(fileLoad.files[0]);
    dataSrc.push(item);
    URL.revokeObjectURL(fileLoad.files[0])
    var li = document.createElement('li');
    var span = document.createElement('span');
    span.setAttribute('data-src',item);
    span.innerHTML = fileLoad.value.replace(/.*((?=\\)|(?=\/))./,'');
    var bDel = document.createElement('button');
    bDel.id = 'buttonDel';
    bDel.value = i;
    bDel.innerText = "Удалить";
    bDel.onclick = musicdelete;
    li.append(span);
    li.append(bDel);
    document.getElementById('list').appendChild(li);
}
function prevOrNextSong(e) {
    if(dataSrc.length==0) { alert("Список воспроизведения пуст! Добавьте аудиозапись."); return;}    
    var sources = document.querySelectorAll('audio');
    audioPlayer = document.getElementById('audio-player');
    var index;
    var targetId = isNaN(e.target)? e : e.target.id;
    for(var i=0;i<dataSrc.length;i++)
    {
        if(sources[0].getAttribute('src')==dataSrc[i])
        {
            index = i;
            break;
        }
    }
    if(targetId=="audio-hud__prev")
    {
        if(index==0){ index= dataSrc.length-1; } else { index -= 1; }
        
    } else 
    {
        if(index==dataSrc.length-1) { index=0; } else { index += 1; }
        
    }
    sources[0].remove();
    var audio = document.createElement('audio');
    audio.className = "audio-player";
    audio.id = "audio-player";
    audio.src = dataSrc[index];
    audioContainer[0].append(audio);
    audioPlayer = document.getElementById('audio-player');
    audioPlayer.addEventListener('timeupdate',audioProgress); //время воспроизведения трека
    audioPlayer.play();
    audioPlayer.oncanplay = function(){
        durationTime.innerHTML = audioTime(audioPlayer.duration);
        actionButton.setAttribute('class','audio-hud__element audio-hud__action audio-hud__action_play');
        audioChangeVolume();
        audioChangeSpeed();
    }
}
function musicdelete(e){
    if (e.target.nodeName === 'BUTTON'){
        dataSrc.splice(e.target.value,1);
        console.log(dataSrc);
        e.target.closest('li').remove()
      }
}

function loadplaylist(){
    var ul = document.createElement('ul');
    ul.id = "list";
    for(i=0;i<dataSrc.length;i++)
    {
        var li = document.createElement('li');
        var span = document.createElement('span');
        span.setAttribute('data-src',dataSrc[i]);
        span.innerHTML = dataSrc[i].replace(/.*((?=\\)|(?=\/))./,'');
        var bDel = document.createElement('button');
        bDel.id = 'buttonDel';
        bDel.value = i;
        bDel.innerText = "Удалить";
        bDel.onclick = musicdelete;
        li.append(span);
        li.append(bDel);
        ul.append(li);
    }
    playlist.append(ul);
}
function clickPlaylist(e){
    audioPlayer = document.getElementById('audio-player');
    var esrc = e.target.getAttribute('data-src');
    var sources = document.querySelectorAll('audio');
    if(sources.length!=0)
    {
        if(sources[0].getAttribute('src')==esrc)
        {
            return;
        } else {
            sources[0].remove();
        }
    }
    var audio = document.createElement('audio');
    audio.className = "audio-player";
    audio.id = "audio-player";
    audio.src = esrc;
    audioContainer[0].append(audio);
    audioPlayer = document.getElementById('audio-player');
    audioPlayer.addEventListener('timeupdate',audioProgress); //время воспроизведения трека
    audioPlayer.play();
    audioPlayer.oncanplay = function(){
        durationTime.innerHTML = audioTime(audioPlayer.duration);
        actionButton.setAttribute('class','audio-hud__element audio-hud__action audio-hud__action_play');
        audioChangeVolume();
        audioChangeSpeed();
    }
}
function audioPlayStop() { //Запускаем или ставим на паузу
    if(audioPlayer.paused) {
        audioPlayer.play();
        actionButton.setAttribute('class','audio-hud__element audio-hud__action audio-hud__action_play');
    } else {
        audioPlayer.pause();
        actionButton.setAttribute('class','audio-hud__element audio-hud__action audio-hud__action_pause');
    }

    if(durationTime.innerHTML == '00:00') {
    durationTime.innerHTML = audioTime(audioPlayer.duration); //Об этой функции чуть ниже
    }

}
function audioTime(time) { //Рассчитываем время в секундах и минутах
    time = Math.floor(time);
    var minutes = Math.floor(time / 60);
    var seconds = Math.floor(time - minutes * 60);
    var minutesVal = minutes;
    var secondsVal = seconds;
    if(minutes < 10) {
        minutesVal = '0' + minutes;
    }
    if(seconds < 10) {
        secondsVal = '0' + seconds;
    }
    return minutesVal + ':' + secondsVal;
}
function audioProgress() { //Отображаем время воспроизведения
    var progress = (Math.floor(audioPlayer.currentTime) / (Math.floor(audioPlayer.duration) / 100));
    if(isNaN(progress)){ 
        progress = 0.0;
    }
    progressBar.value = progress;
    currTime.innerHTML = audioTime(audioPlayer.currentTime);
}
function audioChangeTime(e) { //Перематываем
    var progress;
    if(isNaN(e.pageX)){
        var progress = (Math.floor(audioPlayer.currentTime) / (Math.floor(audioPlayer.duration) / 100));
        audioPlayer.currentTime = audioPlayer.duration * (progress / 100);
    } else {
        var mouseX = Math.floor(e.pageX - progressBar.offsetLeft);
        progress = mouseX / (progressBar.offsetWidth / 100);
        audioPlayer.currentTime = audioPlayer.duration * (progress / 100);
    }
    
}
function audioChangeVolume() { //Меняем громкость
    var volume = volumeScale.value / 100;
    audioPlayer.volume = volume;
    if(audioPlayer.volume == 0) {
        muteButton.setAttribute('class','audio-hud__element audio-hud__mute audio-hud__mute_true');
    } else {
        muteButton.setAttribute('class','audio-hud__element audio-hud__mute audio-hud__mute_false');
    }
}
function audioChangeSpeed() { //Меняем скорость
    var speed = speedSelect.value / 100;
    audioPlayer.playbackRate = speed;
}
function audioMute() { //Убираем звук
    if(audioPlayer.volume == 0) {
        audioPlayer.volume = volumeScale.value / 100;
        muteButton.setAttribute('class','audio-hud__element audio-hud__mute audio-hud__mute_false');
    } else {
        audioPlayer.volume = 0;
        muteButton.setAttribute('class','audio-hud__element audio-hud__mute audio-hud__mute_true');
    }
    
}