window.addEventListener('DOMContentLoaded',()=>{
	document.body.children[0].style.transform="scale("+window.innerHeight/480/window.devicePixelRatio+")";
	console.log('Resize:',document.body.children[0].style.transform);
	const urlParams=new URL(location.href).search;
	const parsedURLParams=new URLSearchParams(urlParams)
	//	获取各种数据
	const play=parsedURLParams.get('play');
	const playLevel=parseInt(parsedURLParams.get('l'));
	const score=parseInt(parsedURLParams.get('score'));
	// const score=
	const maxCombo=parsedURLParams.get('mc');
	const perFect=parsedURLParams.get('p');
	const good=parsedURLParams.get('g');
	const bad=parsedURLParams.get('b');
	const miss=parsedURLParams.get('m');
	const early=parsedURLParams.get('e');
	const accuracy=Math.round((parseInt(perFect)+parseInt(good)*0.65)/(parseInt(perFect)+parseInt(good)+parseInt(bad)+parseInt(miss)+0)*10000)/100;
	const late=good-early;
	var grade;
	document.getElementById('retryBtn').addEventListener('click',()=>{
		location.href='../whilePlaying/index.html?play='+play+'&l='+playLevel+'&c='+parsedURLParams.get('c');
	});
	document.getElementById('backBtn').addEventListener('click',()=>{
		location.href='../songSelect/index.html?c='+parsedURLParams.get('c');
	})
	//	判断等级（范围来自萌娘百科）
	if (score<699999) {
		console.log('Grade: False');
		grade='F15F';
	}
	if (700000<=score&&score<=819999) {
			console.log('Grade:C');
			grade='C15C';
	}
	if (820000<=score&&score<=879999) {
			console.log('Grade:B');
			grade='B15B';
	}
	if (880000<=score&&score<=919999) {
			console.log('Grade:A');
			grade='A15A';
	}
	if (920000<=score&&score<=959999) {
			console.log('Grade:S');
			grade='S15S';
	}
	if (960000<=score&&score<=999999) {
			console.log('Grade:V');
			grade='V15V';
			if (good==0&&bad==0&&miss==0) {
				console.log("Grade: V wih Full Combo")
				grade='V15FC'
			}
	}
	if (1000000<=score) {
			console.log('Grade:Phi');
			grade='phi15phi';
	}
	// switch (score) {
	// 	default:
	// 		console.log('Error, Fallback to False');
	// 		grade='F15F';
	// 		break;
	// }
	// gradeImage
	//	获取歌曲信息
	var songInfoXHR=new XMLHttpRequest();
	songInfoXHR.open('GET',"../charts/"+play+"/meta.json",false);
	songInfoXHR.send();
	window.playResult={
		"score":score,
		"grade": grade,
		"play":play,
		"playLevel":playLevel,
		"songInfo":JSON.parse(songInfoXHR.responseText),
		"maxCombo":maxCombo,
		"accuracy":accuracy,
		"perFect":perFect,
		"good":good,
		"bad":bad,
		"miss":miss,
		"early":early,
		"late":late
	}
	console.log(playResult);
	//	操作DOM修改可见部分数据
	document.querySelector("#levelOverAudio").setAttribute('src',"../assets/audio/LevelOver"+playLevel+".wav");
	document.querySelector("#levelOverAudio").play();
	document.body.setAttribute('style',`background:url(../charts/${playResult.play}/${playResult.songInfo.illustration}) center center no-repeat;`);
	document.querySelector("#songImg").setAttribute("src","../charts/"+play+"/"+playResult.songInfo.illustration.replaceAll('#',"%23"));
	document.querySelector("#score").innerHTML=score.toString().padStart(7,'0');;
	document.querySelector('#gradeImage').src='../assets/images/'+grade+'.png';
	document.querySelector("#maxCombo").innerHTML=maxCombo;
	document.querySelector("#accuracy").innerHTML=accuracy+"%";
	document.querySelector("#perfect").innerHTML=perFect;
	document.querySelector("#good").innerHTML=good;
	document.querySelector("#bad").innerHTML=bad;
	document.querySelector("#miss").innerHTML=miss;
	document.querySelector("#early").innerHTML=early;
	document.querySelector("#late").innerHTML=late;
	// 加载歌曲元信息（计算RKS等）
	var deltaRKS,deltaData;
	// rks=((Y*100-55)/45)²*X
	playLevel == 0 ?level="EZ":undefined;
	playLevel == 1 ?level="HD":undefined;
	playLevel == 2 ?level="IN":undefined;
	playLevel == 3 ?level="AT":undefined;
	if(playResult.accuracy>=70){
		deltaRKS= (Math.pow(((playResult.accuracy-55)/45),2)*playResult.songInfo[level.toLowerCase()+'Ranking']).toFixed(2);
	}else{
		deltaRKS=0
	}
	if (playResult.score<880000) {
		deltaData=0
	}
	document.querySelector("#rks").innerHTML=deltaRKS;
	console.log('ΔRKS:',deltaRKS);
	console.log('ΔData(KB):',deltaData);
});
window.onresize=function(){
	//	自动缩放
	document.body.children[0].style.transform="scale("+window.outerHeight/480+")";
	console.log('Resize:',document.body.children[0].style.transform);
}