from flask_socketio import SocketIO, emit, join_room, leave_room
import os

if os.environ.get('FLASK_ENV') == 'production':
    origins = [
        'http://justochess.onrender.com',
        'https://justochess.onrender.com'
    ]
else:
    origins = "*"


socketio = SocketIO(cors_allowed_origins=origins)


@socketio.on("move")
def on_game(data):
    emit("move", data, to=data['room'], include_self=False)


@socketio.on("reset")
def on_reset(room):
    emit("reset", to=room)


@socketio.on('join')
def on_join(room):
    join_room(room)


@socketio.on('leave')
def on_leave(room):
    leave_room(room)
