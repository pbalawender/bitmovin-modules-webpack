# What it does?
This simple app will run sample DRM protected stream with two mid-roll ad breaks after 10 and 20 seconds of playback.

# How to run this app?
- Clone this repo (probably you already did it ;))
- Run `yarn install`
- Create `.env` file in project root directory with following variable 
```dotenv
BITMOVIN_LICENSE_KEY="'<YOUR-BITMOVIN-LICENSE-KEY-HERE >'"
``` 
- Build code using `yarn build` 
- Run app using `yarn start`
