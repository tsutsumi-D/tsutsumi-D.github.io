//描画エリアのリセット
function reset() {
	signaturePad.clear();
	let elements = document.querySelectorAll(".accuracy");
	elements.forEach(el => {
		el.parentNode.classList.remove('is-selected');
		el.innerText = '-';
	})
}

//canvasに描画されたものをimg.srcに変換
function Canvas2imgSrc(){
	// キャンパス要素を取得 (既に描画されている)
	var ccccc = document.getElementById("draw-area");
	// 描画内容をデータURIに変換する (引数なしだとPNG)
	var dataURI = ccccc.toDataURL("png");
	// img要素を取得
	//var image = document.getElementById("output");
	// データURIは直接img要素のsrc属性に指定できる
	//image.src = dataURI;

	return dataURI;
}

function sleep(waitMsec) {
  var startMsec = new Date();
 
  // 指定ミリ秒間だけループさせる（CPUは常にビジー状態）
  while (new Date() - startMsec < waitMsec);
}

function main(){
	//なぜか非同期じゃないとmodelが読み込めない
	//読み込むまで予測できない
	//仕方ないから余分な処理
	//同じことを繰り返し、modelが読み込まれて、正確な予測ができてるであろう最後のループ処理で予測
	//何回やればmodel読み込んでくれる？//5回くらいかね？
	var repetition = 100;
	for (var i = 0; i <= repetition; i++) {
		predict(i, repetition)
	}
}

//予測を行う
async function predict(num, repetition){
	//alert("======predict START=======")
	const serverPATH = 'https://tsutsumi-d.github.io/';
	//const serverPATH = 'http://127.0.0.1:8887/';
	const model = await tf.loadLayersModel(serverPATH + 'model/model.json');
	//画像オブジェクトを生成
	var width = 28;
	var height = 28;
	var img = new Image();
	//img.src = serverPATH + 'images/004.png';
	img.src = Canvas2imgSrc();
	var canvas = document.createElement("canvas");
		canvas.setAttribute("width", width);
		canvas.setAttribute("height", height);
		var context = canvas.getContext("2d");
		context.drawImage(img, 0, 0, width, height);
		var imageData = context.getImageData(0, 0, width, height);
		const example = tf.fromPixels(imageData, 1).reshape([-1,28,28,1]);
	const prediction = model.predict(example);
	//予測結果アラート
	//alert(prediction)
	//alert("このが画像の数字は")
	//alert(prediction.argMax(-1))
	//alert(prediction.argMax(-1).dataSync())
	//$("#result").text("この画像の数字は「" + prediction.argMax(-1).dataSync() + "」だよ！");

	if (num == repetition) {
		alert(prediction.argMax(-1).dataSync())
	}

}
