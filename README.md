Local Managment for the Pubsub-Emulator
==========

This tool is able to create and remove topic and subscriptions, and publish messages to the PubSub-Emulator.

## Pre-requisites

 - [pubsub-emulator](https://cloud.google.com/pubsub/docs/emulator)
 - [nodejs](https://nodejs.org/en/download/)

## Installation

```bash
 yarn isntall
```

## Config

Set as you want to configure your `.env` from `.env.dist`

```bash
PROJECT_ID=YOUR_PROJECT_ID
TOPIC_NAME=YOUR_TOPIC_NAME
SUBSCRIBER=YOUR_SUBSCRIBER
SUBSCRIPTION_TYPE=YOUR_SUBSCRIPTION_TYPE
PUSH_ENDPOINT=YOUR_WEB_SERVER_FOR_PUSH_SUBSCRIPTIONS
IS_EMULATOR=true
GPC_PUBSUB_API_ENDPOINT=127.0.0.1
GPC_PUBSUB_SERVICE_PATH=127.0.0.1
GPC_PUBSUB_PORT=8085
GPC_PUBSUB_SSL_CREDS=null
```

> Note: For `SUBSCRIPTION_TYPE` could be `PUSH` or `PULL`. Just keep in mind, if the value is `PUSH` you should declare your `PUSH_ENDPOINT` server.

#### Usage

Before to start you should start the emulator using the same `PROJECT_ID` which is declare in your `.env` file.

```bash
gcloud beta emulators pubsub start --project=YOUR_PROJECT_ID
```

Create topic and subscription
 
```bash
yarn run create
```

Remove topic and subscription
 
```bash
yarn run remove
```

Send message to PubSub-Emulator
 
```bash
yarn run publish
```

> Important: In order to send the payload to the emulator you should create the `message.json` with the properties that you need to process.

```json
{
    "payload": "Hello World" 
}
```
