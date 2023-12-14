import string
import secrets

from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.sql import func


class Game(db.Model):
    __tablename__ = 'games'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(12), nullable=False, unique=True, index=True)
    _board = db.Column(
        db.String(255), nullable=False, default='rnbqkbnrpppppppp32PPPPPPPPRNBQKBNR')
    white_id = db.Column(db.Integer, db.ForeignKey(
        add_prefix_for_prod('users.id')))
    black_id = db.Column(db.Integer, db.ForeignKey(
        add_prefix_for_prod('users.id')))
    turn = db.Column(db.String(5), nullable=False, default='white')
    white_long_ok = db.Column(db.Boolean, nullable=False, default=True)
    white_short_ok = db.Column(db.Boolean, nullable=False, default=True)
    black_long_ok = db.Column(db.Boolean, nullable=False, default=True)
    black_short_ok = db.Column(db.Boolean, nullable=False, default=True)
    completed = db.Column(db.Boolean, nullable=False, default=False)
    created_at = db.Column(
        db.DateTime, server_default=func.now(), nullable=False)
    updated_at = db.Column(
        db.DateTime, server_default=func.now(), onupdate=func.now(), nullable=False
    )

    @staticmethod
    def generate_code():
        chars = string.ascii_letters + string.digits
        code = ''.join(secrets.choice(chars) for _ in range(12))
        code_exists = Game.query.filter(Game.code == code).first() is not None
        if (code_exists):
            return Game.generate_code()
        else:
            return code

    def to_dict(self):
        return {
            'id': self.id,
            'code': self.code,
            'board': self.board,
            'white': self.white_id,
            'black': self.black_id,
            'turn': self.turn,
            'createdAt': self.created_at,
            'updatedAt': self.updated_at
        }

    @property
    def board(self):
        nums = '123456890'
        int_string = ''
        decompressed = ''
        for char in self._board:
            if char in nums:
                int_string += char
            else:
                if int_string:
                    decompressed += '.' * int(int_string)
                    int_string = ''
                decompressed += char
        return [list(decompressed[i * 8: (i + 1) * 8]) for i in range(8)]

    @board.setter
    def board(self, board):
        decompressed = ''.join([''.join(row) for row in board])
        count = 0
        compressed = ''
        for char in decompressed:
            if char == '.':
                count += 1
            else:
                if count:
                    compressed += str(count)
                    count = 0
                compressed += char

        self._board = compressed
