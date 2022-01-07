var elm_corpus = document.getElementById("corpus");
var elm_output = document.getElementById("output");
var btn_ngrams = document.getElementById("gen_ngram_btn");
var btn_sample = document.getElementById("gen_sample_btn");
var input_n = document.getElementById("N");
var input_s = document.getElementById("S");

var N = 2;
var n_grams = [];

btn_ngrams.onclick = function(e) {
	N = input_n.value;
	n_grams = []; // Reset.
	let words = elm_corpus.value.replace("\n", " ").split(/\s+/);
	for (var i = (N-1); i < words.length; i++) {
		let n_gram = [];
		for (var n = (i-N+1); n <= i; n++) {
			n_gram.push(words[n]);
		}
		n_grams.push(n_gram);
	}
	console.log(n_grams);
}

btn_sample.onclick = function(e) {
	// Pick a random line to start with, append to sample 
	let sample = [];
	let context = []; 
	let rand_start = n_grams[Math.floor(Math.random()*n_grams.length)];
	for (var n = 0; n < N-1; n++) {
		sample.push(rand_start[n]);
		context.push(rand_start[n]);
	}

	while(sample.length < input_s.value){
		// Find all possible maps from the n-1 context words to a third word
		let candidate_words = [];
		for (var n = 0; n < n_grams.length; n++) {
			let gram = n_grams[n];

			let match = true;
			for (var t = 0; t < N-1; t++){
				if(context[t] != gram[t]){ match = false; break;}
			}
			if(match){ candidate_words.push(gram[N-1]); }
		}

		if(candidate_words.length > 0){
			// Randomly pick one, append it to the current list. 
			let rand_word = candidate_words[Math.floor(Math.random()*candidate_words.length)];
			sample.push(rand_word);
			
			// Update Context
			context.shift();
			context.push(rand_word);
		} else {
			break;
		}
	}

	// print to the output div.
	console.log(sample);
	elm_output.innerHTML = sample.join(" ");
}

btn_ngrams.click();