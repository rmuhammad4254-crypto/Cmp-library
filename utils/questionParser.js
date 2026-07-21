function parseQuestions(text){

    const questions = [];

    const blocks = text.split(/\n\s*\d+\./).filter(Boolean);


    blocks.forEach(block=>{

        const lines = block
        .split("\n")
        .map(line=>line.trim())
        .filter(line=>line);


        if(lines.length >= 6){

            const question = lines[0];

            const optionA = lines.find(l=>l.startsWith("A."));
            const optionB = lines.find(l=>l.startsWith("B."));
            const optionC = lines.find(l=>l.startsWith("C."));
            const optionD = lines.find(l=>l.startsWith("D."));
            const answer = lines.find(l=>l.toLowerCase().startsWith("answer"));


            questions.push({

                question: question,

                option_a: optionA ? optionA.replace("A.","").trim() : "",

                option_b: optionB ? optionB.replace("B.","").trim() : "",

                option_c: optionC ? optionC.replace("C.","").trim() : "",

                option_d: optionD ? optionD.replace("D.","").trim() : "",

                correct_answer: answer 
                ? answer.split(":")[1].trim()
                : ""

            });

        }

    });


    return questions;

}


module.exports = parseQuestions;
