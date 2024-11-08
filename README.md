# SockStar

Simple FastAPI SocketIO implementation in Python with a simple React webpage as its client.

## Start Server
```sh
gunicorn --bind=0.0.0.0:1234 -k uvicorn.workers.UvicornWorker app:socketio_app
```

## Start Client
```sh
npm start
```