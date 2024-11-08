import {useEffect, useState} from "react";
import {io} from "socket.io-client";

const App = (() => {

    const [socket, setSocket] = useState(null);
    const [data, setData] = useState("");

    useEffect(() => {
        connectWebSocket();
        return () => {
            socket.disconnect();
            socket.close();
            setSocket(null);
        };
    }, []);

    const sendPing = () => {
        (async () => {
            const response = await fetch(`/ping`, {
                method: 'POST',
            });
            if (response.ok) {
                setData((oldData) => {
                    return oldData + "\n" + "Pong";
                });
            }
        })();
    };

    const getImmediateResponse = () => {
        if (socket) {
            socket.emit("data", "immediate");
        }
    };

    const getDelayedResponse = () => {
        if (socket) {
            socket.emit("data", "delayed");
        }
    };

    const disconnectWebsocket = () => {
        if (socket) {
            socket.disconnect();
            setSocket(null);
        }
    };

    const connectWebSocket = () => {
        if (!socket) {
            const socket = io(
                "localhost:3000",
                {
                    path: "/sync",
                    transports: ["websocket"]
                }
            );
            socket.open();

            setSocket(socket);

            socket.on("connect", () => {
                setData((oldData) => {
                    oldData += "\n" + "Connected";
                    return oldData;
                });
            })

            socket.on("disconnect", (data) => {
                setData((oldData) => {
                    oldData += "\n" + `Disconnected: ${data}`;
                    return oldData;
                });
            });

            socket.on("message", (data) => {
                setData((oldData) => oldData + "\n" + data);
            });
        }
    };

    const clearOutput = () => {
        setData("");
    };

    return (
        <div style={{fontFamily: "sans-serif"}}>
            <div style={{display: "flex", flexDirection: "horizontal", gap: "10px"}}>
                <span>HTTP</span>
                <button onClick={sendPing}>Ping</button>
                <span>| WebSocket</span>
                <button onClick={connectWebSocket}>Connect</button>
                <button onClick={disconnectWebsocket}>Disconnect</button>
                <button onClick={getImmediateResponse}>Respond Immediately</button>
                <button onClick={getDelayedResponse}>Respond With Delay</button>
                <span>|</span>
                <button onClick={clearOutput}>Clear Output</button>
            </div>
            <hr/>
            <p style={{whiteSpace: "break-spaces"}}>{data}</p>
        </div>
    )
});

export default App;