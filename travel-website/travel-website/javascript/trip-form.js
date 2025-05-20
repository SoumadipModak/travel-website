document.addEventListener('DOMContentLoaded', function() {
    const tripForm = document.getElementById('trip-form');
    const API_KEY = 'AIzaSyB8ccxgVQp7PqThumejacpT_LyXSJtSy8Q';
    const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
    
    // Create results container if it doesn't exist
    const resultsContainer = document.createElement('div');
    resultsContainer.id = 'trip-results-container';
    tripForm.parentNode.insertBefore(resultsContainer, tripForm.nextSibling);
    
    tripForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form values
        const tripData = {
            destination: document.getElementById('destination').value,
            travelDates: document.getElementById('travel-dates').value,
            days: document.getElementById('days').value,
            travelers: document.getElementById('travelers').value,
            budget: document.getElementById('budget').value,
            interests: getSelectedInterests(),
            createdAt: new Date().toISOString()
        };
        
        // Show loading state
        const submitBtn = tripForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading-spinner"></span> Creating your trip plan...';
        
        try {
            // Create detailed Gemini prompt
            const prompt = `Create a ${tripData.days}-day trip to ${tripData.destination} for ${tripData.travelers} people.
            Budget: ${tripData.budget}
            Interests: ${tripData.interests.join(', ')}
            
            Provide this information:
            
            HOTELS:
            - 3 hotel options with names, prices, and brief descriptions
            
            ITINERARY:
            - Daily schedule with morning/afternoon/evening activities
            - Include time estimates and costs
            
            TIPS:
            - Transportation options
            - Money-saving advice
            - Cultural tips`;
            
            // Call Gemini API
            const response = await fetch(`${API_URL}?key=${API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                })
            });
            
            if (!response.ok) throw new Error(`API request failed: ${response.status}`);
            
            const data = await response.json();
            const tripPlan = data.candidates[0].content.parts[0].text;
            
            // Save to localStorage
            saveTripPlan(tripData, tripPlan);
            
            // Display results
            displayTripPlan(tripData, tripPlan);
            
        } catch (error) {
            console.error('Error:', error);
            showError('Failed to generate trip plan. Please try again.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });
    
    // Helper functions
    function getSelectedInterests() {
        const checkboxes = document.querySelectorAll('input[name="interests"]:checked');
        return Array.from(checkboxes).map(cb => cb.value);
    }
    
    function saveTripPlan(tripData, tripPlan) {
        try {
            // Get existing trips or initialize array
            const savedTrips = JSON.parse(localStorage.getItem('savedTrips')) || [];
            
            // Add new trip with unique ID
            const newTrip = {
                id: Date.now(),
                ...tripData,
                plan: tripPlan
            };
            
            savedTrips.push(newTrip);
            localStorage.setItem('savedTrips', JSON.stringify(savedTrips));
            
            return newTrip.id;
        } catch (error) {
            console.error('Error saving trip:', error);
            return null;
        }
    }
    
    function displayTripPlan(tripData, tripPlan) {
        resultsContainer.innerHTML = `
            <div class="trip-plan">
                <h2>Your ${tripData.destination} Trip Plan</h2>
                <div class="trip-meta">
                    <span><i class="far fa-calendar"></i> ${tripData.travelDates}</span>
                    <span><i class="far fa-clock"></i> ${tripData.days} days</span>
                    <span><i class="fas fa-users"></i> ${tripData.travelers} travelers</span>
                </div>
                <div class="plan-content">${formatPlanText(tripPlan)}</div>
                <div class="trip-actions">
                    <button id="save-trip" class="btn-save">
                        <i class="fas fa-bookmark"></i> Save Plan
                    </button>
                    <button id="print-trip" class="btn-print">
                        <i class="fas fa-print"></i> Print Plan
                    </button>
                </div>
            </div>
        `;
        
        // Add event listeners
        document.getElementById('save-trip').addEventListener('click', () => {
            alert('Trip already saved to your plans!');
        });
        
        document.getElementById('print-trip').addEventListener('click', () => {
            window.print();
        });
    }
    
    function formatPlanText(text) {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/# (.*?)(\n|$)/g, '<h3>$1</h3>')
            .replace(/- (.*?)(\n|$)/g, '<li>$1</li>')
            .replace(/\n/g, '<br>')
            .replace(/HOTELS:/i, '<section class="hotels"><h3>Where to Stay</h3>')
            .replace(/ITINERARY:/i, '</section><section class="itinerary"><h3>Daily Plan</h3>')
            .replace(/TIPS:/i, '</section><section class="tips"><h3>Travel Tips</h3>');
    }
    
    function showError(message) {
        resultsContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                ${message}
            </div>
        `;
    }
});