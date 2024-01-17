from flask_socketio import SocketIO, emit, join_room, leave_room
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
    emit("move", data, to=data['code'], include_self=False)


@socketio.on("reset")
def on_reset(code):
    emit("reset", to=code)


@socketio.on('join')
def on_join(code):
    join_room(code)


@socketio.on('leave')
def on_leave(code):
    leave_room(code)
