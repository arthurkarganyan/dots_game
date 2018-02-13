import {createInviteLinkJoint} from "../../client/joints/invite_link_joint";
import {createEventBus} from "../../client/lib/event_bus";

// location.href http://playdots.online/#8lsscy

describe("inviteLinkJoint", function () {
    let eventBus;
    let inviteLinkJoint;
    let docMock;
    
    //
    // TODO reanimate
    // describe("data", function () {
    //     beforeEach(function () {
    //         eventBus = createEventBus();
    //         inviteLinkJoint = createInviteLinkJoint(eventBus);
    //     });
    //
    //     fit("on event with data", () => {
    //         let msgToSend;
    //         eventBus.sub("send_ws_msg", (msg) => {
    //             msgToSend = msg;
    //         });
    //         eventBus.pub("page_load", {href: "http://playdots.online/#8lsscy", hash: "#"});
    //         eventBus.pub("start_wait");
    //
    //         expect(msgToSend.type).toEqual("start_wait");
    //         expect(msgToSend.msg.inviteCode).toEqual("8lsscy");
    //     });
    // });

    describe("code generation", function () {
        beforeEach(function () {
            docMock = {
                elements: {
                    "#copyBtn": {innerText: "Copy"},
                    "#inviteUrl": {
                        select: () => {
                        }
                    },
                    "input#inviteUrl": {},
                    "div#invite": {classList: "", style: {}},
                    "#player-name #ajax-loader": {classList: "", style: {}}
                },
                execCommand: () => {
                },
                querySelector: (selector) => docMock.elements[selector],
                location: {
                    href: "http://example.com/"
                }
            };

            expect(docMock.querySelector("#copyBtn").innerText).toEqual("Copy");

            eventBus = createEventBus();
            inviteLinkJoint = createInviteLinkJoint(eventBus, docMock, () => "awyf83", {});

        });

        it("Button text is changed", () => {
            eventBus.pub('copy_invite_link');
            expect(docMock.querySelector("#copyBtn").innerText).toEqual("Copied!");
        });


        it("URL is generated", () => {
            eventBus.pub('change_current_player_name');
            expect(docMock.querySelector("input#inviteUrl").value).toEqual("example.com/#awyf83");
        });

    });
});


