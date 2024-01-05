from flask_socketio import SocketIO, emit, join_room
import os

if os.environ.get('FLASK_ENV') == 'production':
    origins = [
        'http://reactchesstest.onrender.com',
        'https://reactchesstest.onrender.com'
    ]
else:
    origins = "*"


socketio = SocketIO(cors_allowed_origins=origins)


@socketio.on("move")
def on_game(data):
    emit("move", data, broadcast=True, include_self=False)


@socketio.on("reset")
def on_reset():
    emit("reset", broadcast=True)


@socketio.on('join')
def on_join(data):
    room = data['room']
    join_room[room]
