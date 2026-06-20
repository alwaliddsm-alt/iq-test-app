// متغيرات عامة
let currentQuestion = 0;
let score = 0;
let answers = [];
let userName = '';
let testStartTime = 0;
let testEndTime = 0;
let timeRemaining = 1800; // 30 دقيقة
let timerInterval = null;

// قاعدة البيانات المحلية
let testsData = JSON.parse(localStorage.getItem('iqTestsData')) || [];

// قائمة الأسئلة
const questions = [
    {
        type: 'math',
        question: 'ما هو الحل: 15 + 23 - 8 = ؟',
        options: ['30', '45', '38', '40'],
        correct: 2
    },
    {
        type: 'logic',
        question: 'إذا كانت جميع الفواكه نباتات، وجميع التفاح فواكه، فإن التفاح ___',
        options: ['حيوانات', 'نباتات', 'معادن', 'لا شيء'],
        correct: 1
    },
    {
        type: 'language',
        question: 'أي الكلمات التالية تعني "حزين جداً"؟',
        options: ['مكتئب', 'سعيد', 'منتبه', 'نشيط'],
        correct: 0
    },
    {
        type: 'math',
        question: 'إذا كان 2 × 3 = 6، فما هو 4 × 5 = ؟',
        options: ['9', '20', '15', '25'],
        correct: 1
    },
    {
        type: 'logic',
        question: 'في تسلسل: 2, 4, 6, 8, ... ما هو الرقم التالي؟',
        options: ['9', '10', '11', '12'],
        correct: 1
    },
    {
        type: 'language',
        question: 'ما معنى كلمة "ندي"؟',
        options: ['صديق ندي', 'من يندم على فعل', 'من تربطه بك ندية', 'كل الخيارات'],
        correct: 2
    },
    {
        type: 'visual',
        question: 'إذا كان المربع = 4 جوانب، فإن الدائرة = ؟',
        options: ['3 جوانب', '0 جوانب', 'جوانب لا نهائية', '2 جوانب'],
        correct: 1
    },
    {
        type: 'math',
        question: 'ما هو 20% من 150؟',
        options: ['30', '20', '25', '35'],
        correct: 0
    },
    {
        type: 'logic',
        question: 'إذا كانت الأرنب أسرع من السلحفاة، والسلحفاة أسرع من الحلزون، فإن الأرنب ___',
        options: ['أبطأ من الحلزون', 'أسرع من الحلزون', 'نفس سرعة الحلزون', 'لا نستطيع تحديد'],
        correct: 1
    },
    {
        type: 'language',
        question: 'ما هي مرادف كلمة "جميل"؟',
        options: ['قبيح', 'بديع', 'سيء', 'مؤلم'],
        correct: 1
    },
    {
        type: 'math',
        question: 'إذا اشتريت 3 تفاح بـ 5 ريال لكل واحدة، كم المجموع؟',
        options: ['8', '15', '10', '20'],
        correct: 1
    },
    {
        type: 'logic',
        question: 'ما الشيء الذي يصعد لكنه لا يسقط؟',
        options: ['الطائرة', 'العمر', 'السعر', 'الكل صحيح'],
        correct: 1
    },
    {
        type: 'language',
        question: 'أكمل: "العلم نور و..."',
        options: ['النور علم', 'الجهل ظلام', 'المعرفة قوة', 'الكتاب مرآة'],
        correct: 1
    },
    {
        type: 'visual',
        question: 'إذا كان لديك 2 متوازي أضلاع، كم عدد الأضلاع الكلي؟',
        options: ['4', '8', '6', '10'],
        correct: 1
    },
    {
        type: 'math',
        question: 'ما هو جذر 144؟',
        options: ['10', '12', '14', '16'],
        correct: 1
    },
    {
        type: 'logic',
        question: 'إذا فتحت الباب وسقط المصباح، ماذا تفعل؟',
        options: ['تركض', 'تلتقطه', 'تطفئ الضوء', 'تستدعي الشرطة'],
        correct: 1
    },
    {
        type: 'language',
        question: 'ما معنى "سبات الدب"؟',
        options: ['لعب الدب', 'نوم الدب العميق في الشتاء', 'قفزة الدب', 'صوت الدب'],
        correct: 1
    },
    {
        type: 'math',
        question: 'إذا كان محيط المربع 20 سم، كم طول الضلع الواحد؟',
        options: ['4', '5', '6', '8'],
        correct: 1
    },
    {
        type: 'logic',
        question: 'في تسلسل: 1, 1, 2, 3, 5, 8, 13, ... ما هو الرقم التالي؟',
        options: ['18', '20', '21', '23'],
        correct: 2
    },
    {
        type: 'language',
        question: 'أي من هذه ليست من أركان الإيمان؟',
        options: ['الإيمان بالله', 'الإيمان بالملائكة', 'الإيمان بالجن', 'الإيمان باليوم الآخر'],
        correct: 2
    }
];

// دالة بدء الاختبار
function startTest() {
    userName = document.getElementById('userName').value.trim();
    
    if (!userName) {
        alert('الرجاء إدخال اسمك');
        return;
    }

    currentQuestion = 0;
    score = 0;
    answers = new Array(questions.length).fill(null);
    testStartTime = Date.now();
    timeRemaining = 1800;

    switchScreen('homeScreen', 'testScreen');
    loadQuestion();
    startTimer();
}

// دالة تحميل السؤال
function loadQuestion() {
    if (currentQuestion >= questions.length) {
        finishTest();
        return;
    }

    const question = questions[currentQuestion];
    document.getElementById('questionText').textContent = question.question;
    document.getElementById('questionNumber').textContent = currentQuestion + 1;

    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';

    question.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        if (answers[currentQuestion] === index) {
            optionDiv.classList.add('selected');
        }
        optionDiv.textContent = option;
        optionDiv.onclick = () => selectOption(index);
        optionsContainer.appendChild(optionDiv);
    });

    updateProgress();
    updateButtons();
}

// دالة اختيار الخيار
function selectOption(index) {
    answers[currentQuestion] = index;
    loadQuestion();
}

// دالة التحديث النسبة
function updateProgress() {
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
}

// دالة تحديث الأزرار
function updateButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const finishBtn = document.getElementById('finishBtn');

    prevBtn.style.display = currentQuestion > 0 ? 'block' : 'none';
    finishBtn.style.display = currentQuestion === questions.length - 1 ? 'block' : 'none';
}

// دالة السؤال السابق
function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion();
    }
}

// دالة السؤال التالي
function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < questions.length) {
        loadQuestion();
    } else {
        finishTest();
    }
}

// دالة حساب النتيجة
function calculateResults() {
    score = 0;
    answers.forEach((answer, index) => {
        if (answer === questions[index].correct) {
            score++;
        }
    });
}

// دالة إنهاء الاختبار
function finishTest() {
    testEndTime = Date.now();
    calculateResults();
    
    clearInterval(timerInterval);
    showResults();
}

// دالة عرض النتائج
function showResults() {
    // حساب معدل الذكاء
    const percentage = (score / questions.length) * 100;
    const iqScore = Math.round(100 + (percentage - 50) * 2);
    
    // الحد الأدنى والأقصى للـ IQ
    const finalIQ = Math.max(40, Math.min(200, iqScore));
    
    // تحديد التصنيف
    let classification = '';
    let classificationInfo = '';
    
    if (finalIQ >= 140) {
        classification = 'عبقري ✨';
        classificationInfo = 'مستوى ذكاء استثنائي جداً';
    } else if (finalIQ >= 120) {
        classification = 'ذكاء عالي جداً 🌟';
        classificationInfo = 'قدرات عقلية متميزة';
    } else if (finalIQ >= 110) {
        classification = 'ذكاء عالي 🧠';
        classificationInfo = 'قدرات جيدة فوق المتوسط';
    } else if (finalIQ >= 90) {
        classification = 'متوسط 👍';
        classificationInfo = 'مستوى ذكاء عادي وطبيعي';
    } else if (finalIQ >= 80) {
        classification = 'ذكاء منخفض قليلاً 💭';
        classificationInfo = 'قدرات أقل من المتوسط قليلاً';
    } else {
        classification = 'منخفض جداً ⚠️';
        classificationInfo = 'يحتاج إلى تحسين المهارات';
    }

    const timeSpent = formatTime(Math.floor((testEndTime - testStartTime) / 1000));
    
    document.getElementById('iqScore').textContent = finalIQ;
    document.getElementById('resultName').textContent = userName;
    document.getElementById('correctAnswers').textContent = score + ' / ' + questions.length;
    document.getElementById('percentage').textContent = percentage.toFixed(2) + '%';
    document.getElementById('classification').textContent = classification;
    document.getElementById('timeSpent').textContent = timeSpent;
    
    document.getElementById('classificationBox').innerHTML = `
        <h3>${classification}</h3>
        <p>${classificationInfo}</p>
    `;

    // حفظ البيانات
    const testResult = {
        name: userName,
        iqScore: finalIQ,
        score: score,
        totalQuestions: questions.length,
        percentage: percentage.toFixed(2),
        classification: classification,
        timeSpent: timeSpent,
        date: new Date().toLocaleString('ar-SA'),
        answers: answers
    };
    
    testsData.push(testResult);
    localStorage.setItem('iqTestsData', JSON.stringify(testsData));

    switchScreen('testScreen', 'resultsScreen');
}

// دالة المؤقت
function startTimer() {
    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();
        
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            alert('انتهى الوقت!');
            finishTest();
        }
    }, 1000);
}

// دالة تحديث عرض المؤقت
function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    document.getElementById('timerDisplay').textContent = 
        String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
}

// دالة تنسيق الوقت
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return minutes + ' دقيقة و ' + secs + ' ثانية';
}

// دالة الذهاب للإحصائيات
function goToStats() {
    updateStats();
    switchScreen('homeScreen', 'statsScreen');
}

// دالة تحديث الإحصائيات
function updateStats() {
    const statsContainer = document.getElementById('statsContainer');
    
    if (testsData.length === 0) {
        statsContainer.innerHTML = '<p style="text-align: center; color: #718096;">لا توجد نتائج حتى الآن</p>';
        return;
    }

    statsContainer.innerHTML = '';
    
    // ترتيب النتائج من الأحدث
    const sortedData = [...testsData].reverse();
    
    sortedData.forEach(test => {
        const statItem = document.createElement('div');
        statItem.className = 'stat-item';
        statItem.innerHTML = `
            <div class="stat-item-header">
                <span class="stat-item-name">${test.name}</span>
                <span class="stat-item-score">IQ: ${test.iqScore}</span>
            </div>
            <div class="stat-item-details">
                <p>📊 النسبة: ${test.percentage}% | ✅ الصحيح: ${test.score}/${test.totalQuestions} | ⏱️ ${test.timeSpent}</p>
                <p>🏷️ ${test.classification}</p>
                <p>📅 ${test.date}</p>
            </div>
        `;
        statsContainer.appendChild(statItem);
    });
}

// دالة الذهاب للرئيسية
function goHome() {
    switchScreen(document.querySelector('.screen.active').id, 'homeScreen');
    clearInterval(timerInterval);
}

// دالة التبديل بين الشاشات
function switchScreen(fromScreen, toScreen) {
    document.getElementById(fromScreen).classList.remove('active');
    document.getElementById(toScreen).classList.add('active');
}

// دالة حفظ على Google Sheets
function saveToGoogle() {
    // رابط Google Form (استبدل هذا برابط نموذج Google الخاص بك)
    const googleFormURL = 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform?usp=pp_url';
    
    const lastTest = testsData[testsData.length - 1];
    const params = {
        'entry.NAME': lastTest.name,
        'entry.SCORE': lastTest.iqScore,
        'entry.PERCENTAGE': lastTest.percentage,
        'entry.TIME': lastTest.timeSpent
    };
    
    let url = googleFormURL;
    Object.keys(params).forEach(key => {
        url += '&' + key + '=' + encodeURIComponent(params[key]);
    });
    
    alert('سيتم فتح نموذج Google للحفظ\n(تأكد من تعديل رابط النموذج في الكود)');
    window.open(url, '_blank');
}

// تحميل البيانات عند فتح الصفحة
window.onload = () => {
    // يمكنك إضافة أي تهيئة هنا
};