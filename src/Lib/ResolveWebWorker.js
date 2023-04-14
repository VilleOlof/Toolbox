
let Resolve;

onmessage = function (e) {
    switch (e.type) {
        case MessageType.Resolve:
            Resolve = e.data;
            break;
    }
}