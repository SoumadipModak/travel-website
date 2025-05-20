# travel-website
A modern travel planning web application that helps users create personalized trip itineraries with AI-powered recommendations. The website features destination exploration, trip planning with Google Gemini AI integration, and contact functionality.
Key Features
AI-Powered Trip Planning

Integrated with Google Gemini AI to generate personalized travel plans

Creates complete itineraries including hotels, activities, and transportation

Budget-conscious recommendations

Destination Explorer

Browse popular destinations with filters

View key information like best times to visit and price ranges

"Plan Trip" button for quick access to trip planner

User-Friendly Interface

Clean, responsive design

Interactive forms with validation

Loading states for API calls

Data Persistence

Save trip plans to browser localStorage

View and manage past trips

Contact form submissions storage

Technologies Used
Frontend

HTML5, CSS3, JavaScript

Flexbox and CSS Grid for layouts

Font Awesome icons

Responsive design principles

APIs & Services

Google Gemini AI API

Browser localStorage API

Project Structure
travel-website/
├── css/
│   ├── style.css          # Base styles
│   ├── destinations.css   # Destination page styles
│   ├── contact.css        # Contact page styles
│   └── responsive.css     # Responsive adjustments
├── js/
│   ├── trip-form.js       # Trip planner logic
│   ├── destinations.js    # Destination page logic
│   └── contact.js         # Contact form logic
├── images/                # All website images
│   ├── destinations/      # Destination photos
│   └── contact/           # Contact page images
├── create-trip.html       # Trip planning page
├── destinations.html      # Destination explorer
├── contact.html           # Contact page
└── README.md              # Project documentation
