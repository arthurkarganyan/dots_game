export const createEventBus = () => {
    let eventBus = {};
    let eventList = {};

    eventBus.sub = (key, callback) => {
        let prefix = "on";
        if (key.startsWith("before.")) {
            key = key.substr(7);
            prefix = "before"
        }

        if (key.startsWith("after.")) {
            key = key.substr(6);
            prefix = "after"
        }

        if (!eventList[key])
            eventList[key] = {on: [], before: [], after: []};

        eventList[key][prefix].push(callback);
    };

    eventBus.pub = (key, data) => {
        console.log("Emitted " + key + ", data: " + JSON.stringify(data));

        if (!eventList[key]) {
            console.log("no subscribers found for key: " + key);
            return;
        }

        eventList[key].before.forEach(i => i(data));
        eventList[key].on.forEach(i => i(data));
        eventList[key].after.forEach(i => i(data));
    };

    return eventBus;
};
