document.addEventListener('DOMContentLoaded', () => {
    // Only run if we are on the quiz page
    const quizContainer = document.getElementById('quiz-container');
    if (!quizContainer) return;

    let currentStep = 1;
    const totalSteps = 4;
    let totalScore = 0;

    const progressText = document.getElementById('progress-text');
    const progressFill = document.getElementById('progress-fill');
    const progressWrapper = document.getElementById('progress-wrapper');
    const resultsBody = document.getElementById('results-body');

    const options = document.querySelectorAll('.quiz-option');

    options.forEach(option => {
        option.addEventListener('click', function() {
            // 1. Add score
            const score = parseInt(this.getAttribute('data-score'), 10);
            if (!isNaN(score)) {
                totalScore += score;
            }

            // 2. Transition steps
            const currentElement = document.getElementById(`step-${currentStep}`);
            if (currentElement) {
                currentElement.classList.remove('active');
                currentElement.classList.add('prev-step'); // Slides it to the left
            }

            currentStep++;

            // 3. Show Next Step or Results
            if (currentStep <= totalSteps) {
                // Show next question
                const nextElement = document.getElementById(`step-${currentStep}`);
                if (nextElement) {
                    nextElement.classList.remove('next-step');
                    nextElement.classList.add('active'); // Slides it in from the right
                }

                // Update Progress
                progressText.textContent = `Question ${currentStep} of ${totalSteps}`;
                progressFill.style.width = `${(currentStep / totalSteps) * 100}%`;
                
            } else {
                // Show Results
                progressWrapper.style.display = 'none'; // Hide progress bar
                
                // Populate results message based on score
                if (totalScore > 0) {
                    resultsBody.className = 'results-body results-warning';
                    resultsBody.innerHTML = `
                        <strong>High Risk Detected (${totalScore} Points)</strong><br><br>
                        Your portfolio is carrying unnecessary operational and legal risk. Commingling funds, using outdated or generic leases, or lacking proper emergency protocols in Virginia can lead to severe liabilities and financial penalties.
                    `;
                } else {
                    resultsBody.className = 'results-body results-success';
                    resultsBody.innerHTML = `
                        <strong>Solid Foundation (0 Points)</strong><br><br>
                        You are running a tight ship! Your legal and operational foundation is strong. But if you are already operating at a professional standard, why do the heavy lifting manually?
                    `;
                }

                // Transition to results step
                const resultsElement = document.getElementById('step-results');
                if (resultsElement) {
                    resultsElement.classList.remove('next-step');
                    resultsElement.classList.add('active');
                }
            }
        });
    });
});
