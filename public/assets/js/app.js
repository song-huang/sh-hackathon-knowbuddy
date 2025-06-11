// Main Application Logic
class ProspectPulseApp {
    constructor() {
        this.currentStep = 0;
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupExamples();
        this.loadFeatures();
    }

    bindEvents() {
        // Bind analyze button
        const analyzeBtn = document.getElementById('analyzeBtn');
        if (analyzeBtn) {
            analyzeBtn.addEventListener('click', () => this.startAnalysis());
        }

        // Bind enter key on input
        const companyInput = document.getElementById('companyInput');
        if (companyInput) {
            companyInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.startAnalysis();
                }
            });
        }
    }

    setupExamples() {
        // Setup example buttons
        AppData.examples.forEach((example) => {
            const button = document.querySelector(`[onclick="setExample('${example}')"]`);
            if (button) {
                button.addEventListener('click', () => this.setExample(example));
                button.removeAttribute('onclick');
            }
        });
    }

    loadFeatures() {
        const featuresGrid = document.getElementById('featuresGrid');
        if (featuresGrid && AppData.features) {
            const featuresHTML = AppData.features.map(feature => `
                <div class="text-center text-white/80">
                    <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                        ${feature.icon}
                    </div>
                    <h3 class="font-semibold mb-2">${feature.title}</h3>
                    <p class="text-sm">${feature.description}</p>
                </div>
            `).join('');
            featuresGrid.innerHTML = featuresHTML;
        }
    }

    setExample(company) {
        const input = document.getElementById('companyInput');
        if (input) {
            input.value = company;
        }
    }

    startAnalysis() {
        const input = document.getElementById('companyInput').value.trim();
        if (!input) {
            alert('Please enter a company name or website');
            return;
        }

        // Hide search, show loading
        this.showSection('loadingSection');
        this.hideSection('heroSection');

        // Reset and animate loading steps
        this.currentStep = 0;
        this.animateLoadingSteps();

        // Simulate analysis (replace with actual API call)
        setTimeout(() => {
            this.showResults(input);
        }, 8000);
    }

    animateLoadingSteps() {
        const stepElements = document.querySelectorAll('#loadingSteps > div');

        const updateStep = () => {
            if (this.currentStep < AppData.loadingSteps.length) {
                // Update previous step to success
                if (this.currentStep > 0) {
                    const prevStep = stepElements[this.currentStep - 1];
                    const dot = prevStep.querySelector('.w-2');
                    const text = prevStep.querySelector('span');

                    dot.className = 'w-2 h-2 bg-success rounded-full';
                    text.className = 'text-gray-700 text-sm';
                }

                // Update current step to active
                if (this.currentStep < stepElements.length) {
                    const currentStepEl = stepElements[this.currentStep];
                    const dot = currentStepEl.querySelector('.w-2');
                    const text = currentStepEl.querySelector('span');

                    dot.className = 'w-2 h-2 bg-warning rounded-full typing-indicator';
                    text.className = 'text-gray-700 text-sm';
                    text.textContent = AppData.loadingSteps[this.currentStep];
                }

                this.currentStep++;
                if (this.currentStep <= AppData.loadingSteps.length) {
                    setTimeout(updateStep, 1500);
                }
            }
        };

        updateStep();
    }

    showResults(company) {
        // Hide loading, show results
        this.hideSection('loadingSection');
        this.showSection('resultsSection');

        // Generate results HTML
        const resultsHTML = this.generateResultsHTML(company);
        document.getElementById('resultsSection').innerHTML = resultsHTML;
    }

    generateResultsHTML(company) {
        const data = AppData.demoResults;

        return `
            ${this.generateHeader()}
            <div class="max-w-4xl mx-auto px-6 py-6">
                ${this.generateCompanyOverview(company, data.companyInfo)}
                ${this.generateInsightsGrid(data)}
                ${this.generateKeyInsights(data.insights)}
                ${this.generateDataSources(data.dataSources)}
            </div>
        `;
    }

    generateHeader() {
        return `
            <div class="bg-white shadow-sm border-b sticky top-0 z-50">
                <div class="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                        <button onclick="location.reload()" class="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors text-sm">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 256 256">
                                <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"/>
                            </svg>
                            <span>New Search</span>
                        </button>
                        <div class="h-4 w-px bg-gray-300"></div>
                        <h1 class="text-lg font-semibold text-gray-800">${AppData.brand.name}</h1>
                    </div>
                    <div class="flex items-center space-x-3">
                        <button class="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md text-sm font-medium">
                            Export Report
                        </button>
                        <button class="border border-gray-300 hover:border-primary text-gray-700 hover:text-primary px-4 py-2 rounded-md text-sm font-medium">
                            Save to CRM
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    generateCompanyOverview(company, info) {
        return `
            <div class="bg-white rounded-xl shadow-lg overflow-hidden mb-6 animate-fade-in">
                <div class="bg-gray-700 p-6 text-white">
                    <div class="flex items-start justify-between">
                        <div>
                            <h2 class="text-2xl font-bold mb-2">${company}</h2>
                            <p class="text-gray-200 text-base">${info.description}</p>
                        </div>
                        <div class="flex space-x-2">
                            <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 256 256">
                                    <path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="p-6">
                    <div class="grid grid-cols-4 gap-4">
                        <div class="text-center">
                            <div class="text-2xl font-bold text-primary mb-1">${info.founded}</div>
                            <div class="text-xs text-gray-500">Founded</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-success mb-1">${info.size}</div>
                            <div class="text-xs text-gray-500">Size</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-accent mb-1">${info.category}</div>
                            <div class="text-xs text-gray-500">Category</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-warning mb-1">${info.priceRange}</div>
                            <div class="text-xs text-gray-500">Price Range</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    generateInsightsGrid(data) {
        return `
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                ${this.generateConversationStarters(data.conversationStarters)}
                ${this.generateObjectionHandling(data.objections)}
            </div>
        `;
    }

    generateConversationStarters(starters) {
        const startersHTML = starters.map(starter => `
            <div class="bg-gray-50 rounded-lg p-3 border-l-4 border-${starter.color}-500">
                <div class="flex items-start space-x-3">
                    <div class="w-5 h-5 bg-${starter.color}-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span class="text-white text-xs font-bold">${starter.id}</span>
                    </div>
                    <p class="text-gray-700 text-sm">${starter.text}</p>
                </div>
                <button class="mt-2 text-xs text-${starter.color}-500 hover:text-${starter.color}-600 font-medium">📋 Copy</button>
            </div>
        `).join('');

        return `
            <div class="bg-white rounded-xl shadow-md p-5 animate-slide-up">
                <div class="flex items-center space-x-3 mb-5">
                    <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24Zm0,192a87.87,87.87,0,0,1-44.06-11.81,8,8,0,0,0-6.54-.67L40,216,52.47,178.6a8,8,0,0,0-.66-6.54A88,88,0,1,1,128,216Z"/>
                        </svg>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-800">Conversation Starters</h3>
                </div>
                <div class="space-y-3">
                    ${startersHTML}
                </div>
            </div>
        `;
    }

    generateObjectionHandling(objections) {
        const objectionsHTML = objections.map(obj => `
            <div class="border border-gray-200 rounded-lg p-3">
                <div class="mb-2">
                    <div class="flex items-center space-x-2 mb-1">
                        <div class="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span class="text-red-600 text-xs font-semibold">Objection:</span>
                    </div>
                    <p class="text-gray-700 text-xs ml-4">${obj.objection}</p>
                </div>
                <div>
                    <div class="flex items-center space-x-2 mb-1">
                        <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span class="text-green-600 text-xs font-semibold">Response:</span>
                    </div>
                    <p class="text-gray-700 text-xs ml-4">${obj.response}</p>
                </div>
                <button class="mt-2 text-xs text-blue-500 hover:text-blue-600 font-medium">📋 Copy Response</button>
            </div>
        `).join('');

        return `
            <div class="bg-white rounded-xl shadow-md p-5 animate-slide-up" style="animation-delay: 0.1s;">
                <div class="flex items-center space-x-3 mb-5">
                    <div class="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                        <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM222.93,203.8a8.5,8.5,0,0,1-7.48,4.2H40.55a8.5,8.5,0,0,1-7.48-4.2,7.59,7.59,0,0,1,0-7.72L120.52,44.21a8.75,8.75,0,0,1,15,0l87.45,151.87A7.59,7.59,0,0,1,222.93,203.8ZM120,144V104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,180Z"/>
                        </svg>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-800">Objection Handling</h3>
                </div>
                <div class="space-y-3">
                    ${objectionsHTML}
                </div>
            </div>
        `;
    }

    generateKeyInsights(insights) {
        const opportunitiesHTML = insights.opportunities.map(opp => `
            <li class="flex items-start space-x-2">
                <div class="w-1 h-1 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>${opp}</span>
            </li>
        `).join('');

        const strengthsHTML = insights.strengths.map(strength => `
            <li class="flex items-start space-x-2">
                <div class="w-1 h-1 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>${strength}</span>
            </li>
        `).join('');

        return `
            <div class="bg-white rounded-xl shadow-md p-5 mb-6 animate-fade-in" style="animation-delay: 0.2s;">
                <div class="flex items-center space-x-3 mb-5">
                    <div class="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                        <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"/>
                        </svg>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-800">Key Business Insights</h3>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <h4 class="font-semibold text-green-600 mb-3 text-sm">🚀 Growth Opportunities</h4>
                        <ul class="space-y-2 text-xs text-gray-700">
                            ${opportunitiesHTML}
                        </ul>
                    </div>
                    <div>
                        <h4 class="font-semibold text-blue-600 mb-3 text-sm">💪 Key Strengths</h4>
                        <ul class="space-y-2 text-xs text-gray-700">
                            ${strengthsHTML}
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }

    generateDataSources(sources) {
        const sourcesHTML = sources.map(source => `
            <div class="text-center p-3 bg-gray-50 rounded-lg">
                <div class="w-10 h-10 bg-blue-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <span class="text-white text-sm">${source.icon}</span>
                </div>
                <div class="font-medium text-gray-800 text-xs">${source.name}</div>
                <div class="text-xs text-gray-500">${source.description}</div>
            </div>
        `).join('');

        return `
            <div class="bg-white rounded-xl shadow-md p-5 animate-scale-in" style="animation-delay: 0.3s;">
                <div class="flex items-center space-x-3 mb-5">
                    <div class="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                        <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z"/>
                        </svg>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-800">Data Sources Analyzed</h3>
                </div>
                <div class="grid grid-cols-4 gap-3">
                    ${sourcesHTML}
                </div>
                <div class="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div class="flex items-center space-x-2">
                        <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span class="text-xs text-green-700 font-medium">Analysis completed in 8.2 seconds • All data sources active</span>
                    </div>
                </div>
            </div>
        `;
    }

    showSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.remove('hidden');
            if (sectionId === 'heroSection') {
                section.style.display = 'block';
            }
        }
    }

    hideSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            if (sectionId === 'heroSection') {
                section.style.display = 'none';
            } else {
                section.classList.add('hidden');
            }
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ProspectPulseApp();
});

// Legacy function support for onclick handlers
function setExample(company) {
    if (window.app) {
        window.app.setExample(company);
    }
}

function startAnalysis() {
    if (window.app) {
        window.app.startAnalysis();
    }
}
