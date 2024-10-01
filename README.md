# Fertilizer Optimizer Frontend (React Native)

### Sustainable Fertilizer Usage Optimizer for Higher Yield

This project is a mobile application built with **React Native** as part of the **Smart India Hackathon 2024**. The app allows users to input soil data, crop type, and location to receive tailored fertilizer recommendations to optimize yield, ensure sustainable agricultural practices, and improve farmer income. 

## Features

- **User-friendly interface** for inputting soil health data, crop type, and location.
- Integration with **Location APIs** to fetch weather data.
- Fetches **NPK (Nitrogen, Phosphorus, Potassium)** data based on the crop type.
- Provides **optimal fertilizer recommendations** based on a neural network model.
- **Organic fertilizer suggestions** for sustainable nutrient management.


## Tech Stack

- **React Native**: Mobile app development framework.
- **API Integration**: 
  - Fetch weather data using location => [WeatherAPI](https://www.weatherapi.com/).
  - Fetch crop-specific NPK data.
- **Backend**:
  - Backend model (FastAPI) to calculate fertilizer type and amount.[Go to Backend](https://github.com/B-a-b-u/FO_API)
  - **Neural Network** => Classfication Neural Network with Softmax function. [View Model Code](https://colab.research.google.com/drive/119ifp2jShgDod6BZxuQdMUzsVxNImcbP?usp=sharing)
  
## Prototye
 - [Go to Figma Prototype](https://www.behance.net/gallery/209183187/Fertilizer-Optimizer-%28ECOYIELD%29).
   - [Done by Kishorkumar](https://github.com/kishorkumar005)   
## Installation and Setup

1. Clone the repository:
    ```bash
    git clone https://github.com/B-a-b-u/Fertilizer_Frontend.git
    cd Fertilizer_Frontend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Run the app on an emulator or connected device:
    ```bash
    npm run android
    # or for iOS
    npm run ios
    ```

4. The Backend API is hosted on [Render](https://render.com/).
   - The Backend API Link : [FO_API](https://fo-api.onrender.com)

## API Integration

- **Location API**: I used Expo Location to get users latitude and longitude.
- **Weather API**: I used WeatherAPI.
- **Backend API**: Neural Network-based recommendation system (FastAPI) calculates the optimal fertilizer based on soil health, crop type, and weather conditions.

## Dataset
- [kaggle](https://www.kaggle.com/datasets/gdabhishek/fertilizer-prediction/data)

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature-branch-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-branch-name`
5. Open a pull request.

