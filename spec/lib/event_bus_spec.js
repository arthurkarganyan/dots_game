import {createEventBus} from "../../client/lib/event_bus";

describe("eventBus", function () {
    let eventBus;
    let subscriber;

    describe("without data", function () {
        beforeEach(function () {
            eventBus = createEventBus();
            subscriber = {received: "no"};

            subscriber.OnMegaEvent = () => subscriber.received = "yes";
        });

        it("on event with data", () => eventBus.sub("mega_event", subscriber.OnMegaEvent));
        it("before event with data", () => eventBus.sub("before.mega_event", subscriber.OnMegaEvent));
        it("after event with data", () => eventBus.sub("after.mega_event", subscriber.OnMegaEvent));

        afterEach(function () {
            expect(subscriber.received).toEqual("no");
            eventBus.pub("mega_event");
            expect(subscriber.received).toEqual("yes");
        });
    });

    describe("multiple subscribers", () => {
        let subscriber2;

        beforeEach(function () {
            eventBus = createEventBus();
            subscriber = {received: "no"};
            subscriber2 = {received: "no"};

            eventBus.sub("mega_event", () => subscriber.received = "yes");
            eventBus.sub("mega_event", () => subscriber2.received = "yes");
        });

        it("works", function () {
            expect(subscriber.received).toEqual("no");
            expect(subscriber2.received).toEqual("no");

            eventBus.pub("mega_event");

            expect(subscriber.received).toEqual("yes");
            expect(subscriber2.received).toEqual("yes");
        });

    });

    it("on event with data", function () {
        subscriber = {lastMsg: null};

        subscriber.onMegaEvent = (data) => {
            subscriber.lastMsg = data;
        };

        eventBus.sub("mega_event", subscriber.onMegaEvent);
        eventBus.pub("mega_event", "22");
        expect(subscriber.lastMsg).toEqual("22");
    });
});


