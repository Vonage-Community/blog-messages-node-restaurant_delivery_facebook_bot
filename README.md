# Is It Delivering? A Facebook Bot built in NodeJS

[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg)](CODE_OF_CONDUCT.md)
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE.txt)
A simple demo app to demonstrate a Facebook Bot build with Vonage Messages API, LokiJS, and Wolt


* [Requirements](#requirements)
* [Installation](#installation)
* [Usage](#usage)
* [License](#license)

# Requirements

* You'll need a Vonage API account. You can [sign up here](https://dashboard.nexmo.com/sign-up)
* You'll need the latest version of the [NodeJS](https://nodejs.org/en/)

## Installation

Once you clone the repository, first change into the directory and execute the following commands in your terminal:

```bash
$ ngrok http 3000
```

In a second terminal winow, you'll need to execute the following command:
```bash
$ node index.js
```

Lastly, rename the `.env.sample` file to `.env`.

## Usage

To use this app you must sign up for an account with the Vonage API Dashboard. Once you have an account, you can create a
new video project. That project will assign you an APP_ID. Your account also provides an API KEY and SECRET. Copy those values into your `.env`
file in the `API_KEY`, `API_SECRET`, and `APP_ID` parameters, respectively.

You also must also add your ngrok URLs to the Vonage Dashboard in two places: the application configuration and in the Messages API Sandbox. You can learn more about Sandbox Setup [here](https://developer.nexmo.com/messages/concepts/messages-api-sandbox#setup-your-sandbox).


## License

This library is released under the [MIT License][license]

[license]: LICENSE.md
