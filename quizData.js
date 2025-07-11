
(function () {
    const quizText = `

[TIMER:60]



`.trim();

    const lines = quizText.split('\n');
    let parsedMCQs = '';
    let correctAnswers = {};
    let testTimer = 60;
    let questionIndex = 1;
    let currentQuestionText = '', currentOptions = '', inputName = '', timerSet = false;

    lines.forEach(line => {
        const text = line.trim();

        if (!timerSet && text.startsWith('[TIMER:')) {
            const match = text.match(/\[TIMER:\s*(\d+)\]/i);
            if (match) {
                testTimer = parseInt(match[1]) * 60;
                timerSet = true;
            }
        } else if (/^\d+\./.test(text)) {
            if (currentQuestionText && currentOptions) {
                parsedMCQs += `<div class="question" data-question-id="q${questionIndex}"><div class="question-text"><strong>${currentQuestionText}</strong></div>${currentOptions}</div>`;
                questionIndex++;
            }
            currentQuestionText = text;
            currentOptions = '';
            inputName = `q${questionIndex}`;
        } else if (/^[\*\-]?[A-Da-d]\./.test(text)) {
            const isCorrect = /^\*/.test(text);
            const cleanOption = text.replace(/^\*\s*/, '');
            currentOptions += `<label><input type="radio" name="${inputName}" value="${cleanOption}"> ${cleanOption}</label>`;
            if (isCorrect) {
                correctAnswers[inputName] = cleanOption;
            }
        }
    });

    // Add the last question
    if (currentQuestionText && currentOptions) {
        parsedMCQs += `<div class="question" data-question-id="q${questionIndex}"><div class="question-text">${currentQuestionText}</div>${currentOptions}</div>`;
    }

    const meta = {
        correctAnswers: correctAnswers,
        timeLimit: testTimer,
        testId: Date.now()
    };

    localStorage.setItem('mcqData', parsedMCQs);
    localStorage.setItem('mcqMeta', JSON.stringify(meta));
})();


