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


@socketio.on("game")
def on_game(data):
    # room = data['room']
    game_state = data
    emit("game", data, broadcast=True)

@socketio.on('join')
def on_join(data):
    room = data['room']
    join_room[room]
