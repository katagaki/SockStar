from datetime import datetime

from fastapi import FastAPI
from fastapi.responses import JSONResponse, FileResponse
from socketio import AsyncServer, ASGIApp, AsyncNamespace

app = FastAPI()
sio = AsyncServer(
    async_mode="asgi",
    cors_allowed_origins="*",
    logger=True,
    engineio_logger=True
)


@app.get("/{path:path}")
async def serve_react_app(path: str):
    return FileResponse("./web/build/index.html")


@app.post("/ping")
def http_call():
    return JSONResponse({}, 200)


class StarNamespace(AsyncNamespace):
    async def on_connect(self, sid, environ):
        print("connect ", sid)
        await sio.enter_room(sid, "Room 1")

    async def on_data(self, sid, data):
        if str(data) == "immediate":
            await sio.send("This response was generated immediately.", to="Room 1")

        elif str(data) == "delayed":
            async def send_time_at_regular_intervals():
                await sio.sleep(3)
                date_now: str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                await sio.send(f"This response was generated at {date_now}.", to="Room 1")

            await sio.start_background_task(send_time_at_regular_intervals)

    async def on_disconnect(self, sid):
        await sio.leave_room(sid, "Room 1")


sio.register_namespace(StarNamespace("/"))

socketio_app = ASGIApp(sio, app, socketio_path="/sync")
