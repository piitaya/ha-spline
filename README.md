# 〰️ Spline

[![hacs][hacs-badge]][hacs-url]
[![release][release-badge]][release-url]
![downloads][downloads-badge]
![build][build-badge]

<a href="https://www.buymeacoffee.com/piitaya" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/white_img.png" alt="Buy Me A Coffee" style="height: auto !important;width: auto !important;" ></a>

## What is Home Assistant Spline?

Home Assistant Spline is a custom card to build interactive 3D models for [Home Assistant][home-assistant] Dashboard using is a [Spline](spline)

## Installation

### HACS

1. Install HACS if you don't have it already
2. Open HACS in Home Assistant
3. Add https://github.com/piitaya/ha-spline repository
4. Search for "Spline"
5. Click the download button. ⬇️

### Manual

1. Download `spline.js` file from the [latest release][release-url].
2. Put `spline.js` file into your `config/www` folder.
3. Add reference to `spline.js` in Dashboard. There's two way to do that:
   - **Using UI:** _Settings_ → _Dashboards_ → _More Options icon_ → _Resources_ → _Add Resource_ → Set _Url_ as `/local/spline.js` → Set _Resource type_ as `JavaScript Module`.
     **Note:** If you do not see the Resources menu, you will need to enable _Advanced Mode_ in your _User Profile_
   - **Using YAML:** Add following code to `lovelace` section.
     ```yaml
     resources:
       - url: /local/spline.js
         type: module
     ```

## Development server

### Home assistant demo

You can run a demo instance of Home Assistant with docker by running:

```sh
npm run start:hass
```

Once it's done, go to Home Assistant instance [http://localhost:8123](http://localhost:8123) and start configuration.

#### Windows Users

If you are on Windows, either run the above command in Powershell, or use the below if using Command Prompt:

```sh
npm run start:hass-cmd
```

### Development

In another terminal, install dependencies and run development server:

```sh
npm install
npm start
```

Server will start on port `4000`.

### Build

You can build the `spline.js` file in `dist` folder by running the build command.

```sh
npm run build
```

<!-- Badges -->

[hacs-url]: https://github.com/hacs/integration
[hacs-badge]: https://img.shields.io/badge/hacs-default-orange.svg?style=flat-square
[release-badge]: https://img.shields.io/github/v/release/piitaya/ha-spline?style=flat-square
[downloads-badge]: https://img.shields.io/github/downloads/piitaya/ha-spline/total?style=flat-square
[build-badge]: https://img.shields.io/github/actions/workflow/status/piitaya/ha-spline/build.yml?branch=main&style=flat-square

<!-- References -->

[home-assistant]: https://www.home-assistant.io/
[spline]: https://spline.design/
[hacs]: https://hacs.xyz
[release-url]: https://github.com/piitaya/ha-spline/releases
