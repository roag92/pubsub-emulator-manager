require('dotenv').config();
const argv = require('yargs').argv
const colors = require('colors/safe');
const { PubSub } = require('@google-cloud/pubsub');
const { readFileSync } = require('fs');

const { 
    PROJECT_ID, 
    TOPIC_NAME,
    SUBSCRIBER,
    SUBSCRIPTION_TYPE,
    PUSH_ENDPOINT,
    IS_EMULATOR, 
    GPC_PUBSUB_API_ENDPOINT,
    GPC_PUBSUB_SERVICE_PATH,
    GPC_PUBSUB_PORT,
    GPC_PUBSUB_SSL_CREDS,
} = process.env;

const MODE = 'mode';
const VERBOSE = 'verbose';

const OPTION_CREATE = 'create';
const OPTION_REMOVE = 'remove';
const OPTION_PUBLISH = 'publish';

if (!argv[MODE]) {
    console.error(colors.red(`Your must specify the --${MODE}=${OPTION_CREATE} || ${OPTION_REMOVE} || ${OPTION_PUBLISH})`));

    process.exit(-1);
}

const pubsub = new PubSub({
    apiEndpoint: GPC_PUBSUB_API_ENDPOINT,
    servicePath: GPC_PUBSUB_SERVICE_PATH,
    port: GPC_PUBSUB_PORT,
    sslCreds: GPC_PUBSUB_SSL_CREDS, 
});

pubsub.projectId = PROJECT_ID;
pubsub.isEmulator = IS_EMULATOR;
pubsub.options.port = GPC_PUBSUB_PORT;

const errorCallback = (err) => {
    if (argv[VERBOSE] === true) {
        console.log(err);
    }

    console.error(colors.red(err.message));

    process.exit(-1);
}

const completeCallback = () => {
    console.log(colors.green(`Operation completed: --${MODE}=${argv[MODE]}`));
}

const create = () => {
    let options = null;
    
    if (SUBSCRIPTION_TYPE === 'PUSH') {
        options = {
            pushConfig: {
                pushEndpoint: PUSH_ENDPOINT,
            },
        };
    }

    pubsub.createTopic(TOPIC_NAME)
        .then((topic) => {
            pubsub.topic(TOPIC_NAME).createSubscription(SUBSCRIPTION, options)
                .then((subscription) => {
                    completeCallback();
                })
                .catch(errorCallback);
        })
        .catch(errorCallback);
}

const remove = () => {   
    pubsub.subscription(SUBSCRIPTION).delete()
        .then((resultSubscription) => {
            pubsub.topic(TOPIC_NAME).delete()
                .then(resultTopic => {
                    completeCallback();
                })
                .catch(errorCallback);
        })
        .catch(errorCallback);
}

const publish = () => {
    pubsub.topic(TOPIC_NAME)
        .publish(
            Buffer.from(readFileSync('./message.json', 'utf8')),
            {
                name: TOPIC_NAME
            }
        )
        .then((data) => {
            completeCallback();
        })
        .catch(errorCallback);
}

const SUBSCRIPTION = `projects/${PROJECT_ID}/subscriptions/${SUBSCRIBER}`;

switch(argv[MODE]) {
    case OPTION_CREATE:
        create();

        break;
    case OPTION_REMOVE:
        remove();

        break;
    case OPTION_PUBLISH:
        publish();

        break;
}
