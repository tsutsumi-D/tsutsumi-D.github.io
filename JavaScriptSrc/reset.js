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

//処理を一時停止させる関数
function sleep(waitMsec) {
  var startMsec = new Date();
  // 指定ミリ秒間だけループさせる（CPUは常にビジー状態）
  while (new Date() - startMsec < waitMsec);
}


function LoadImage(){
	//画像オブジェクトを生成
	var width = 28;
	var height = 28;
	var img = new Image();
	//img.src = serverPATH + 'images/004.png';
	img.src = Canvas2imgSrc()
	var canvas = document.createElement("canvas");
		canvas.setAttribute("width", width);
		canvas.setAttribute("height", height);
	var context = canvas.getContext("2d"); //ここにawaitがあれば
		context.drawImage(img, 0, 0, width, height);
	var imageData = context.getImageData(0, 0, width, height);
	//const example = tf.fromPixels(imageData, 1).reshape([-1,28,28,1]);
	const example = tf.browser.fromPixels(imageData, 1).reshape([-1,28,28,1]);
}

async function predict(){
	/*
	 * canvas より描画画像を読み込む
	 * 読み込んだ画像を適切な形式に変換
	 * 変換された画像を入力に予測
	 *
	 * awaitはここだけつけてた
	 * const model = await tf.loadLayersModel(serverPATH + 'model/model.json');
	 * しかしこれだと画像の読み込みが追いつかない。よって他もawait
	 *
	 */

	//画像を読み込み
	await LoadImage();
	//github pages のパス
	const serverPATH = 'https://tsutsumi-d.github.io/';
	//const serverPATH = 'http://127.0.0.1:8887/';
	const model = await tf.loadLayersModel(serverPATH + 'model/model.json');
	//画像オブジェクトを生成
	var width = 28;
	var height = 28;
	var img = new Image();
	//img.src = serverPATH + 'images/004.png';
	img.src = await Canvas2imgSrc();
	var canvas = await document.createElement("canvas");
		await canvas.setAttribute("width", width);
		await canvas.setAttribute("height", height);
	var context = await canvas.getContext("2d"); //ここにawaitがあれば
		await context.drawImage(img, 0, 0, width, height);
	var imageData = await context.getImageData(0, 0, width, height);
	//const example = tf.fromPixels(imageData, 1).reshape([-1,28,28,1]);
	const example = await tf.browser.fromPixels(imageData, 1).reshape([-1,28,28,1]);
	const prediction = await model.predict(example);
	
	//debugコンソール出力
	//console.log(prediction)
	//console.log("このが画像の数字は")
	//console.log(prediction.argMax(-1))
	//console.log(prediction.argMax(-1).dataSync())
    //console.log(example)
    //console.log(prediction)

    //予測結果を文字列にする
    const result = await prediction.argMax(-1).dataSync().join(',')
	await add("AIはこの数字を" + result + "と判断しました")
	await alert("AIはこの数字を" + result + "と判断しました")
}


function add(addText){
	const div1 = document.getElementById("predictResult");
	// 要素の追加
	const p1 = document.createElement("div");
	const text1 = document.createTextNode(addText);
	p1.appendChild(text1);
	div1.appendChild(p1);
}





