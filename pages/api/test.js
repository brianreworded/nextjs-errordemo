const deepl = require('deepl-node');
const authKey = process.env.DEEPL_API_KEY; // API key a
const translator = new deepl.Translator(authKey);

//below, text to summarize and translate

export default async function handler(req, res) {
    if (req.method === 'GET') {
        return await retrieveInquiry(req, res);
    }
}

async function retrieveInquiry(req, res){
    var results = await summarize_translate()
    console.log("Results: ", results) //debugging
    if (results.length > 0){
        return res.status(200).json(results, {success: true});
    }
    else {
        return res.status(500).json({ message: 'Results not found', success: false });
    }
}





async function summarize_translate(){
    const txts =  "Bees are insects that make honey. Bees come from the superfamily Apoidea. There are over 16,000 species of bees in seven recognized biological families. Bees are found on every continent except Antarctica."
    var result_txt = ""


    //summarize text
    const responsed = await fetch(
        "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
        {
            headers: { Authorization: `Bearer ${process.env.NLP_ID}` }, //process.env.SUMMARY_ID
            method: 'POST',
            body: JSON.stringify(txts),
        }
    );
    var response = await responsed.json();
    result_txt = response[0]['summary_text'];
    console.log("Result_txt = ", result_txt) //debugging


    //translate text
    await translator.translateText(result_txt, 'en', 'es').then(ress => {
        console.log("translated text: ", ress.text) //debugging
        result_txt = ress.text;
    }).catch(err => {
        console.error(err);
    });

    return result_txt //return result
}
